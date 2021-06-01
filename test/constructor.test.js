import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("MyPromise constructor", () => {
  test("new MyPromise", () => {
    new MyPromise((resolve) => {
      resolve(1)
    })
  })

  test("pending", () => {
    var p = new MyPromise(() => {})
    expect(p.promiseState).toBe(PENDING)
  })

  test("fulfilled", () => {
    var p = new MyPromise((resolve) => {
      resolve()
    })
    expect(p.promiseState).toBe(FULFILLED)
  })

  test("rejected", () => {
    var p = new MyPromise((_, reject) => {
      reject()
    })
    expect(p.promiseState).toBe(REJECTED)
  })

  test("resolve value", () => {
    var p = new MyPromise((resolve) => {
      resolve("abc")
    })
    expect(p.promiseResult).toBe("abc")
  })

  test("reject value", () => {
    var p = new MyPromise((_, reject) => {
      reject("err")
    })
    expect(p.promiseResult).toBe("err")
  })

  test("async resolve", (done) => {
    var p = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve("abc")
      })
    })
    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(FULFILLED)
      expect(p.promiseResult).toBe("abc")
      done()
    })
  })

  test("async reject", (done) => {
    var p = new MyPromise((_, reject) => {
      setTimeout(() => {
        reject("abc")
      })
    })
    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(REJECTED)
      expect(p.promiseResult).toBe("abc")
      done()
    })
  })

  test("resolve fulfilled promise", (done) => {
    var p = new MyPromise((resolve) => {
      resolve(
        new MyPromise((resolve) => {
          setTimeout(() => resolve("xixi"))
        })
      )
    })

    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(FULFILLED)
      expect(p.promiseResult).toBe("xixi")
      done()
    })
  })

  test("resolve rejected promise", (done) => {
    var p = new MyPromise((resolve) => {
      resolve(
        new MyPromise((_, reject) => {
          setTimeout(() => reject("xixi"))
        })
      )
    })

    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(REJECTED)
      expect(p.promiseResult).toBe("xixi")
      done()
    })
  })

  test("reject fulfilled promise", (done) => {
    var p = new MyPromise((_, reject) => {
      reject(
        new MyPromise((resolve) => {
          setTimeout(() => resolve("xixi"))
        })
      )
    })

    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(FULFILLED)
      expect(p.promiseResult).toBe("xixi")
      done()
    })
  })

  test("reject rejected promise", (done) => {
    var p = new MyPromise((reject) => {
      reject(
        new MyPromise((_, reject) => {
          setTimeout(() => reject("xixi"))
        })
      )
    })

    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(REJECTED)
      expect(p.promiseResult).toBe("xixi")
      done()
    })
  })
})
