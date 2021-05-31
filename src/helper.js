export function rejectWhenAbnormal(runner, reject) {
  try {
    runner()
  } catch (err) {
    reject()
  }
}

export function isPromise(p) {
  return p.then && typeof p.then === "function"
}
