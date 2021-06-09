import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("any", () => {
  test("primitive values", (done) => {
    MyPromise.any([1, 2, 3]).then((res) => {
      expect(res).toBe(1)
      done()
    })
  })

  test("muiltiple values", (done) => {
    MyPromise.any([MyPromise.reject(1), 2, 3, MyPromise.resolve(4), 5]).then(
      (res) => {
        expect(res).toBe(2)
        done()
      }
    )
  })

  test("all rejected", (done) => {
    var p1 = MyPromise.any([
      MyPromise.reject(4),
      MyPromise.reject(5),
      new MyPromise((_, reject) => {
        setTimeout(() => {
          reject(6)
        })
      }),
    ])

    p1.catch((error) => {
      // AggregateError is supported on node.js 15
      expect(error).toBeInstanceOf(AggregateError)
      expect(error.message).toBe("All Promises rejected")
      expect(error.errors).toEqual([4, 5, 6])
      done()
    })
  })
})
