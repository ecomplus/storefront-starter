exports.handler = ({ path }, context, callback) => {
  if (/\.(js|css|ico|png|gif|jpg|jpeg|webp|svg)$/.test(path)) {
    return callback(null, {
      statusCode: 404,
      'Cache-Control': 'public, max-age=60'
    })
  }

  let statusCode = 200
  const headers = {}

  const req = {
    url: path.charAt(0) === '/' ? path : `/${path}`
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

  process.env.STOREFRONT_BASE_DIR = __dirname
  const { ssr } = require('@ecomplus/storefront-renderer/functions/')
  ssr(req, res)
}
