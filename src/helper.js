export const PENDING = 0
export const FULFILLED = 1
export const REJECTED = 2

export function rejectWhenAbnormal(runner, reject) {
  try {
    runner()
  } catch (err) {
    reject()
  }
}

export function isPromise(p) {
  return p && p.then && typeof p.then === "function"
}

/**
 * 根据其他 promise 变更当前 promise 状态
 * @param {*} resultPromise 
 * @param {*} resolve 
 * @param {*} reject 
 */
export function handleNextResolveOrNextRejectWithResultPromise(
  resultPromise,
  resolve,
  reject
) {
  if (resultPromise.promiseState === PENDING) {
    resultPromise.then(resolve, reject)
  } else if (resultPromise.promiseState === FULFILLED) {
    resolve(resultPromise.promiseResult)
  } else {
    reject(resultPromise.promiseResult)
  }
}
