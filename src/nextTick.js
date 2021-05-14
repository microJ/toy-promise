/**
 * --- node.js ---
 * 1. process.nextTick
 * 2. queueMicrotask
 *
 * --- Morden browser ---
 * Promise
 *
 * --- IE 11 ---
 * 3. MutationObserver
 *
 * --- IE 10 ---
 * 4. MessageChannel
 *
 * --- IE 6~10 ---
 * 5. <script> onreadystatechange
 */

;(function () {
  var nextTick = undefined

  if (self.MutationObserver) {
    nextTick = getNextTickByMutationObserver()
  }
  //
  else if (self.MessageChannel) {
    nextTick = getNextTickByMessageChannel()
  }
  //
  else {
    nextTick = nextTickByOnReadyStateChange
  }

  if (typeof process === "object" && !process.nextTick) {
    process.nextTick = nextTick
  } else {
    self.process = { nextTick: nextTick }
  }

  var callbacks = []
  function addCallback(cb) {
    callbacks.push(cb)
  }
  function executeCallbacks() {
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i]()
    }

    callbacks.length = 0
  }

  function getNextTickByMutationObserver() {
    var counter = 1
    var observer = new MutationObserver(executeCallbacks)
    var node = document.createTextNode(counter + "")
    observer.observe(node, { characterData: true })
    return function nextTickByMutationObserver(cb) {
      addCallback(cb)
      node.data = (++counter % 2) + ""
    }
  }

  function getNextTickByMessageChannel() {
    var channel = new MessageChannel()
    channel.port1.onmessage = executeCallbacks
    return function nextTickByMessageChannel(cb) {
      addCallback(cb)
      channel.port2.postMessage(0)
    }
  }

  function nextTickByOnReadyStateChange(cb) {
    addCallback(cb)

    var scriptEl = document.createElement("script")
    scriptEl.onreadystatechange = function () {
      executeCallbacks()

      scriptEl.onreadystatechange = null
      scriptEl.parentNode.removeChild(scriptEl)
      scriptEl = null
    }

    document.documentElement.appendChild(scriptEl)
  }
})()
