'use strict'

module.exports = class Request {

  constructor(data) {
    Object.assign(this, data)
  }

  match(query = {}) {
    return new Promise((resolve, reject) => {
      if (Object.keys(query).every(key => this[key] === query[key]))
        resolve(this);
      else reject()
    })
  }
}
