import { nextTick } from "./nextTick.js"
import {
  rejectWhenAbnormal,
  isPromise,
  handleNextResolveOrNextRejectWithResultPromise,
  PENDING,
  FULFILLED,
  REJECTED,
} from "./helper.js"

export class MyPromise {
  _promiseState = PENDING
  get promiseState() {
    return this._promiseState
  }
  set promiseState(state) {
    if (this._promiseState !== PENDING) {
      return
    }
    this._promiseState = state

    this.stateChangeHandlers.forEach((handler) => {
      if (state === FULFILLED) {
        handler.handleFulfilledAsync()
      } else {
        handler.handleRejectedAsync()
      }
    })
  }

  /**
   * 需要传递给下一个 promise 的值
   * 赋值时机：new Promise((resolve, reject) => {}) 调用 resolve/reject 时设置的值
   * 如果该值是 promise，则 .then() 调用时将 onFulfilled/onRejected 挂载到该 promise
   */
  promiseResult = undefined

  /**
   * { handleFulfilledAsync, handleRejectedAsync }
   * .then() 时候注册
   * promiseState 变更的时候执行
   */
  stateChangeHandlers = []

  constructor(executor) {
    const resolve = (result) => {
      this.promiseResult = result
      this.promiseState = FULFILLED
    }
    const reject = (result) => {
      this.promiseResult = result
      this.promiseState = REJECTED
    }

    rejectWhenAbnormal(() => {
      executor(
        (val) => {
          if (isPromise(val)) {
            handleNextResolveOrNextRejectWithResultPromise(val, resolve, reject)
          } else {
            resolve(val)
          }
        },
        (reason) => {
          if (isPromise(reason)) {
            handleNextResolveOrNextRejectWithResultPromise(
              reason,
              resolve,
              reject
            )
          } else {
            reject(reason)
          }
        }
      )
    }, reject)
  }

  then(onFulfilled, onRejected) {
    let nextResolve, nextReject
    const nextPromise = new MyPromise((resolve, reject) => {
      nextResolve = resolve
      nextReject = reject
    })

    // 改变 nextPromise 的状态并向其传递值
    const handleFulfilledAsync = () =>
      handleFulfilledOrRejectedAsync(onFulfilled)

    const handleRejectedAsync = () => handleFulfilledOrRejectedAsync(onRejected)

    const handleFulfilledOrRejectedAsync = (handler) => {
      nextTick(() => {
        let nextPromiseResult
        rejectWhenAbnormal(() => {
          nextPromiseResult = handler(this.promiseResult)
        }, nextReject)
        if (isPromise(nextPromiseResult)) {
          handleNextResolveOrNextRejectWithResultPromise(
            nextPromiseResult,
            nextResolve,
            nextReject
          )
        } else {
          nextResolve(nextPromiseResult)
        }
      })
    }

    // 根据状态处理对 nextPromise 的状态变更
    if (this.promiseState === PENDING) {
      this.stateChangeHandlers.push({
        handleFulfilledAsync,
        handleRejectedAsync,
      })
    } else if (this.promiseState === FULFILLED) {
      handleFulfilledAsync()
    } else {
      handleRejectedAsync()
    }

    return nextPromise
  }

  catch(onRjected) {
    return this.then(() => {}, onRjected)
  }

  finally(onFinally) {
    return this.then(
      () => {
        onFinally()
      },
      () => {
        onFinally()
      }
    )
  }

  /**
   * static methods
   */
  static resolve(val) {
    return new MyPromise((resolve, reject) => {
      if (isPromise(val)) {
        handleNextResolveOrNextRejectWithResultPromise(val, resolve, reject)
      } else {
        resolve(val)
      }
    })
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      if (isPromise(reason)) {
        handleNextResolveOrNextRejectWithResultPromise(reason, resolve, reject)
      } else {
        reject(reason)
      }
    })
  }

  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = []
      let resolvedCount = 0

      const tryResolveAll = () => {
        if (resolvedCount === promiseList.length) {
          resolve(result)
        }
      }

      promiseList.forEach((p, i) => {
        if (isPromise(p)) {
          handleNextResolveOrNextRejectWithResultPromise(
            p,
            (val) => {
              resolvedCount++
              result[i] = val
              tryResolveAll()
            },
            reject
          )
        } else {
          resolvedCount++
          result[i] = p
          tryResolveAll()
        }
      })
    })
  }

  static allSettled(promiseList) {
    return new MyPromise((resolve) => {
      const result = []
      let resolvedCount = 0

      const tryResolveAll = () => {
        if (resolvedCount === promiseList.length) {
          resolve(result)
        }
      }

      promiseList.forEach((p, i) => {
        if (isPromise(p)) {
          handleNextResolveOrNextRejectWithResultPromise(
            p,
            (val) => {
              resolvedCount++
              result[i] = {
                status: "fulfilled",
                value: val,
              }
              tryResolveAll()
            },
            (reason) => {
              resolvedCount++
              result[i] = {
                status: "rejected",
                reason: reason,
              }
              tryResolveAll()
            }
          )
        } else {
          resolvedCount++
          result[i] = {
            status: "fulfilled",
            value: p,
          }
          tryResolveAll()
        }
      })
    })
  }

  static any(promiseList) {
    return new MyPromise((resolve, reject) => {
      let settled = false
      let reasonList = []
      let rejectedCount = 0

      const tryResolveAny = (val) => {
        if (!settled) {
          resolve(val)
          settled = true
        }
      }

      const tryRejectAny = () => {
        if (!settled && rejectedCount === promiseList.length) {
          reject(new AggregateError(reasonList, "All Promises rejected"))
          settled = true
        }
      }

      promiseList.some((p, i) => {
        if (isPromise(p)) {
          handleNextResolveOrNextRejectWithResultPromise(
            p,
            (val) => {
              tryResolveAny(val)
            },
            (reason) => {
              rejectedCount++
              reasonList[i] = reason
              tryRejectAny()
            }
          )
        } else {
          tryResolveAny(p)
          return true
        }
      })
    })
  }

  /**
   * The Promise.race() method returns a promise that fulfills or rejects
   * as soon as one of the promises in an iterable fulfills or rejects,
   * with the value or reason from that promise.
   * @param {*} promiseList
   * @returns
   */
  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      let done = false
      const tryResolveRace = (value) => {
        if (!done) {
          resolve(value)
          done = true
        }
      }
      const tryRejectRace = (reason) => {
        if (!done) {
          reject(reason)
          done = true
        }
      }
      promiseList.some((p) => {
        if (isPromise(p)) {
          handleNextResolveOrNextRejectWithResultPromise(
            p,
            tryResolveRace,
            tryRejectRace
          )
          if (p.promiseState !== PENDING) {
            return true
          }
        } else {
          resolve(p)
          return true
        }
      })
    })
  }
}
