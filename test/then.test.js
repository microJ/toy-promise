import { describe, test, expect } from "@jest/globals"
import { MyPromise, PENDING, FULFILLED, REJECTED } from "../src/index"
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
})
