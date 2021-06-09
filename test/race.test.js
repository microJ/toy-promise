import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("race", () => {
  test("primitive values", (done) => {
    MyPromise.race([1, 2, 3]).then((res) => {
      expect(res).toBe(1)
      done()
    })
  })

  test("fulfilled promise", (done) => {
    MyPromise.race([MyPromise.resolve(1), 2]).then((res) => {
      expect(res).toBe(1)
      done()
    })
  })

  test("rejected promise", (done) => {
    MyPromise.race([MyPromise.reject(1), 2]).catch((res) => {
      expect(res).toBe(1)
      done()
    })
  })

  test("resolve faster", (done) => {
    var p1 = MyPromise.race([
      new MyPromise((resolve) => {
        setTimeout(() => {
          resolve(1)
        }, 10)
      }),
      new MyPromise((_, reject) => {
        setTimeout(() => {
          reject(2)
        }, 100)
      }),
    ])

    p1.then((value) => {
      expect(value).toBe(1)
      done()
    })
  })

  test("reject faster", (done) => {
    var p1 = MyPromise.race([
      new MyPromise((resolve) => {
        setTimeout(() => {
          resolve(1)
        }, 100)
      }),
      new MyPromise((_, reject) => {
        setTimeout(() => {
          reject(2)
        }, 10)
      }),
    ])

    p1.catch((value) => {
      expect(value).toBe(2)
      done()
    })
  })
})
