import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("finally", () => {
  test("after constructor resolve", (done) => {
    new MyPromise((resolve) => {
      resolve(1)
    }).finally(() => {
      done()
    })
  })

  test("after constructor reject", (done) => {
    new MyPromise((_, reject) => {
      reject(1)
    }).finally(() => {
      done()
    })
  })

  test("after then", (done) => {
    var p0 = new MyPromise((resolve) => {
      resolve(1)
    })
    var p1 = p0.then(() => {
      return "then"
    })
    p1.finally(() => {
      done()
    })
  })

  test("after catch", (done) => {
    MyPromise.reject().finally(() => {
      done()
    })
  })

  test("after finally", (done) => {
    var a
    MyPromise.reject()
      .finally(() => {
        a = 1
      })
      .finally(() => {
        expect(a).toBe(1)
        done()
      })
  })
})
