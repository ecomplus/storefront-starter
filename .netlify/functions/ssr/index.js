const path = require('path')

process.env.NODE_ENV = 'production'
process.env.STOREFRONT_BASE_DIR = __dirname
process.env.STOREFRONT_BUNDLES_PATH = path.join(`${__dirname}/bundles.json`)

exports.handler = (ev, context, callback) => {
  if (/\.(js|css|ico|png|gif|jpg|jpeg|webp|svg)$/.test(ev.path)) {
    return callback(null, {
      statusCode: 404,
      'Cache-Control': 'public, max-age=60'
    })
  }

  let statusCode = 200
  const headers = {}

  const req = {
    url: ev.path.charAt(0) === '/' ? ev.path : `/${ev.path}`
  }

  const res = {
    set (header, value) {
      headers[header] = value
      return res
    },
    status (status) {
      statusCode = status
      return res
    },
    end () {
      callback(null, { statusCode, headers })
      return res
    },
    send (body) {
      callback(null, { statusCode, headers, body })
      return res
    }
  }

  const { ssr } = require('@ecomplus/storefront-renderer/functions/')
  ssr(req, res)
}
