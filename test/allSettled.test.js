import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("allSettled", () => {
  test("primitive values", (done) => {
    MyPromise.allSettled([1, 2, 3]).then((res) => {
      expect(res).toEqual([
        { status: "fulfilled", value: 1 },
        { status: "fulfilled", value: 2 },
        { status: "fulfilled", value: 3 },
      ])
      done()
    })
  })

  test("muiltiple values", (done) => {
    MyPromise.allSettled([1, 2, 3, MyPromise.resolve(4), 5]).then((res) => {
      expect(res).toEqual([
        { status: "fulfilled", value: 1 },
        { status: "fulfilled", value: 2 },
        { status: "fulfilled", value: 3 },
        { status: "fulfilled", value: 4 },
        { status: "fulfilled", value: 5 },
      ])
      done()
    })
  })

  test("reject value", (done) => {
    MyPromise.allSettled([1, 2, 3, MyPromise.reject(4), 5]).then((res) => {
      expect(res).toEqual([
        { status: "fulfilled", value: 1 },
        { status: "fulfilled", value: 2 },
        { status: "fulfilled", value: 3 },
        { status: "rejected", reason: 4 },
        { status: "fulfilled", value: 5 },
      ])
      done()
    })
  })
})
