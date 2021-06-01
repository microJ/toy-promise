import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index.js"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("static methods", () => {
  test("MyPromise.resolve()", () => {
    var p = MyPromise.resolve(1)
    expect(p.promiseState).toBe(FULFILLED)
    expect(p.promiseResult).toBe(1)
  })

  test("MyPromise.resolve(promise)", (done) => {
    var p = MyPromise.resolve(
      new MyPromise((resolve) => {
        setTimeout(() => resolve(1))
      })
    )
    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(FULFILLED)
      expect(p.promiseResult).toBe(1)
      done()
    })
  })

  test("MyPromise.reject()", () => {
    var p = MyPromise.reject(1)
    expect(p.promiseState).toBe(REJECTED)
    expect(p.promiseResult).toBe(1)
  })

  test("MyPromise.reject(promise)", (done) => {
    var p = MyPromise.reject(
      new MyPromise((_, reject) => {
        setTimeout(() => reject(1))
      })
    )
    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(REJECTED)
      expect(p.promiseResult).toBe(1)
      done()
    })
  })

  test("MyPromise.reject(promise)", (done) => {
    var p = MyPromise.reject(
      new MyPromise((_, reject) => {
        setTimeout(() => reject(1))
      })
    )

    p.catch((reason) => {
      expect(reason).toBe(1)
    })

    expect(p.promiseState).toBe(PENDING)
    expect(p.promiseResult).toBe(undefined)

    setTimeout(() => {
      expect(p.promiseState).toBe(REJECTED)
      expect(p.promiseResult).toBe(1)
      done()
    })
  })
})
