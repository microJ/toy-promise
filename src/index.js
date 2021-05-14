/**
 * new Promise((resolve, reject) => {})
 * p.then((prev) => { return value }, (reason) => { return value })
 * p.catch((reason) => { return value })
 * Promise.resolve()
 * Promise.reject()
 */

const STATUS_PENDING = "pending"
const STATUS_FULFILLED = "fulfilled"
const STATUS_REJECTED = "rejected"

class Promise {
  _promiseState = STATUS_PENDING
  get promiseState() {
    return this._promiseState
  }
  /**
   * 状态发生变更时，调用注册的回调函数
   */
  set promiseState(v) {
    if (this._promiseState !== STATUS_PENDING) {
      return
    }

    this._promiseState = v

    this.callbacks.forEach(({ onFulfilled, onRejected }) => {
      if (v === STATUS_FULFILLED) {
        onFulfilled && onFulfilled()
      } else {
        onRejected && onRejected()
      }
    })
  }

  /**
   * 需要传递给下一个 promise 的值
   * 赋值时机：
   * 1. new Promise(resolve, reject) 调用 resolve/reject 时接受的值
   * 2. then(onFulfilled, onRejected)/catch(onRejected) 调用 onFulfilled/onRejected 时的返回值
   */
  promiseResult = undefined
  callbacks = []

  /**
   * 1. 声明 resolve, reject
   * 2. 安全执行函数
   */
  constructor(executor) {
    const resolve = (val) => {
      this.promiseResult = val
      this.promiseState = STATUS_FULFILLED
    }

    const reject = (reason) => {
      this.promiseResult = reason
      this.promiseState = STATUS_REJECTED
    }

    safeDoSettle(executor, resolve, reject)
  }

  /**
   * 返回新的 promise
   * 保存回调
   */
  then(onFulfilled, onRejected) {
    /**
     * next promise
     */
    let resolve, reject
    let p = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })

    const doResolve = () => {
      process.nextTick(() => {
        safeRun(() => {
          const result = onFulfilled(this.promiseResult)
          resolve(result)
        }, reject)
      })
    }

    const doReject = () => {
      process.nextTick(() => {
        safeRun(() => {
          const result = onRejected(this.promiseResult)
          resolve(result)
        }, reject)
      })
    }

    // 注入回调，等待状态变更
    if (this._promiseState === STATUS_PENDING) {
      this.callbacks.push({
        onFulfilled: doResolve,
        onRejected: doReject,
      })
    }
    // fulfilled
    else if (this._promiseState === STATUS_FULFILLED) {
      doResolve()
    }
    // rejected
    else {
      doReject()
    }

    return p
  }

  catch(onRejected) {
    return this.then(() => {}, onRejected)
  }

  //   static resolve(val) {
  //     return new Promise((resolve) => {
  //       resolve(val)
  //     })
  //   }

  //   static reject(val) {
  //     return new Promise((_, reject) => {
  //       reject(val)
  //     })
  //   }
}

function safeDoSettle(executor, resolve, reject) {
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

function safeRun(executor, onError) {
  try {
    executor()
  } catch (err) {
    onError(err)
  }
}
