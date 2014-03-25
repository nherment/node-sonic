
function logger(data, options) {
  console.log('logger', options.message, JSON.stringify(data))
  this.next()
}
module.exports = logger
