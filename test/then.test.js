import { describe, test, expect } from "@jest/globals"
import { MyPromise } from "../src/index"
import { PENDING, FULFILLED, REJECTED } from "../src/helper"

describe("then", () => {
  test("accept constructor value", () => {
    new MyPromise((resolve) => {
      resolve(1)
    }).then((res) => {
      expect(res).toBe(1)
    })
  })

  test("accept then value", () => {
    var p0 = new MyPromise((resolve) => {
      resolve(1)
    })
    var p1 = p0.then(() => {
      return "then"
    })
    var p2 = p1.then((res) => {
      expect(res).toBe("then")
    })
  })

  test("async callback", (done) => {
    function runPromise(P) {
      var a = []
      var p0 = new P((resolve) => {
        a.push(0)
        resolve()
      })
      a.push(1)
      p0.then(() => a.push(2))
      p0.then(() => a.push(3))
      a.push(4)
      return a
    }

    var a1 = runPromise(MyPromise)
    var a2 = runPromise(Promise)
    setTimeout(() => {
      expect(a1.join() === a2.join()).toBe(true)
      done()
    })
  })

  test("pass fulfilled promise", (done) => {
    var p = MyPromise.resolve().then(
      () =>
        new MyPromise((resolve) => {
          setTimeout(() => resolve(1))
        })
    )

    expect(p.promiseResult).toBe(undefined)
    expect(p.promiseState).toBe(PENDING)
    setTimeout(() => {
      expect(p.promiseResult).toBe(1)
      expect(p.promiseState).toBe(FULFILLED)
      done()
    }, 10)
  })

  test("pass rejected promise", (done) => {
    var p = MyPromise.resolve().then(
      () =>
        new MyPromise((_, reject) => {
          setTimeout(() => reject(1))
        })
    )

    expect(p.promiseResult).toBe(undefined)
    expect(p.promiseState).toBe(PENDING)
    setTimeout(() => {
      expect(p.promiseResult).toBe(1)
      expect(p.promiseState).toBe(REJECTED)
      done()
    }, 10)
  })
})
