import { nextTick } from "./nextTick.js"
import { rejectWhenAbnormal, isPromise } from "./helper.js"

export const PENDING = 0
export const FULFILLED = 1
export const REJECTED = 2

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
        handler.handleFulfilledAsync
      } else {
        handler.handleRejectedAsync
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
      executor(resolve, reject)
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
        rejectWhenAbnormal(() => {
          const nextPromiseResult = handler(this.promiseResult)
          if (isPromise(nextPromiseResult)) {
            nextPromiseResult.then(nextResolve, nextReject)
          } else {
            nextResolve(nextPromiseResult)
          }
        }, nextReject)
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
}
