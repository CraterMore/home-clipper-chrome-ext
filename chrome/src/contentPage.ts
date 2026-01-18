chrome.runtime.onMessage.addListener((request, _, cb) => {
  const handler = new Promise<string>((resolve, reject) => {
    if (request) {
      resolve(document.body.innerHTML)
    } else {
      reject('request is empty.')
    }
  })

  handler.then((message) => cb(message)).catch((error) => cb(error))

  return true
})
