import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("all", () => {
  test("primitive values", (done) => {
    MyPromise.all([1, 2, 3]).then((res) => {
      expect(res).toEqual([1, 2, 3])
      done()
    })
  })

  test("muiltiple values", (done) => {
    MyPromise.all([1, 2, 3, MyPromise.resolve(4), 5]).then((res) => {
      expect(res).toEqual([1, 2, 3, 4, 5])
      done()
    })
  })

  test("reject value", (done) => {
    MyPromise.all([1, 2, 3, MyPromise.reject(4), 5]).catch((reason) => {
      expect(reason).toBe(4)
      done()
    })
  })
})
