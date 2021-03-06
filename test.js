import { MyPromise } from "./src/index.js"
import { PENDING, FULFILLED, REJECTED } from "../src/helper.js"

window.originPromise = Promise
window.Promise = MyPromise

// var p0 = new Promise(() => {})
// console.log(p0.promiseState === PENDING)

// var p = new Promise((resolve) => resolve(1))
// console.log(JSON.stringify(p))
// console.log(p.promiseState === FULFILLED, p.promiseResult === 1)
// p.then((val) => {
//   console.log(val === 1)
//   return 2
// }).then((val) => console.log(val, val === 2))

// var p1 = new Promise((_, reject) => reject("rejected"))
// console.log(JSON.stringify(p1))
// console.log(p1.promiseState === REJECTED, p1.promiseResult === "rejected")

// p1.then(
//   () => {},
//   (val) => {
//     console.log(val === "rejected")
//     return 1
//   }
// ).then((val) => {
//   console.log(val, val === 1)
// })

// p1.catch((reason) => {
//   console.log("catch", reason === "rejected")
// })

// var p2 = new Promise((resolve, reject) => {
//   setTimeout(resolve)
// })
// p2.then(() => {
//   console.log("p2 then 1")
// })
// p2.then(() => {
//   console.log("p2 then 2")
//   return 1
// }).then((res) => {
//   console.log(res === 1)
// })

// console.log(p2)

// var p1 = MyPromise.all([1, 2, 3, MyPromise.resolve(4), 5])
// setTimeout(() => {
//   console.log(p1)
//   p1.then((res) => {
//     console.log(res, res.join() === "1,2,3,4,5")
//   })
// })

var p1 = MyPromise.any([
  MyPromise.reject(4),
  MyPromise.reject(5),
  new MyPromise((_, reject) => {
    setTimeout(() => {
      reject(6)
    }, 20)
  }),
])
console.log(p1)
// p1.then((res) => {
//   console.log("then", res)
// })
p1.catch((error) => {
  console.log("catch", error)
})
