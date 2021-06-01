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
