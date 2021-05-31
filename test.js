import { MyPromise, PENDING, FULFILLED, REJECTED } from "./src/index.js"

window.originPromise = Promise
window.Promise = MyPromise

var p0 = new Promise(() => {})
console.log(p0.promiseState === PENDING)

var p = new Promise((resolve) => resolve(1))
console.log(JSON.stringify(p))
console.log(p.promiseState === FULFILLED, p.promiseResult === 1)
p.then((val) => {
  console.log(val === 1)
  return 2
}).then((val) => console.log(val, val === 2))

var p1 = new Promise((_, reject) => reject("rejected"))
console.log(JSON.stringify(p1))
console.log(p1.promiseState === REJECTED, p1.promiseResult === "rejected")

p1.then(
  () => {},
  (val) => {
    console.log(val === "rejected")
    return 1
  }
).then((val) => {
  console.log(val, val === 1)
})

p1.catch((reason) => {
  console.log("catch", reason === "rejected")
})

var p2 = new Promise((resolve, reject) => {
  setTimeout(resolve)
})
p2.then(() => {
  console.log("p2 then 1")
})
p2.then(() => {
  console.log("p2 then 2")
})
console.log(p2)