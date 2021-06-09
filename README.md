# toy-promise

实现一个简单的 promise。

nextTick is supported by [@microJ](https://github.com/microJ/nextTick)

文章链接：

1. https://blog.expect2.cyou/views/front-end/2021/0420/write-promise-polyfill-with-a-clear-idea-1.html
2. https://blog.expect2.cyou/views/front-end/2021/0420/write-promise-polyfill-with-a-clear-idea-2.html
3. https://blog.expect2.cyou/views/front-end/2021/0420/write-promise-polyfill-with-a-clear-idea-3.html
4. https://blog.expect2.cyou/views/front-end/2021/0420/write-promise-polyfill-with-a-clear-idea-4.html

## api

| api                  | done |
| :------------------- | :--: |
| MyPromise            |  ✅  |
| .resolve()           |  ✅  |
| .reject()            |  ✅  |
| .prototype.then()    |  ✅  |
| .ptototype.catch()   |  ✅  |
| .ptototype.finally() |  ✅  |
| .all()               |  ✅  |
| .allSettled()        |  ✅  |
| .any()               |  ✅  |
| .race()              |  ✅  |
