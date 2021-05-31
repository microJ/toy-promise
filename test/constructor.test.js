import { describe, test, expect } from "@jest/globals"
import { MyPromise, PENDING, FULFILLED, REJECTED } from "../src/index"

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
})
