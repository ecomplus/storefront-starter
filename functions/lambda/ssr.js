const { ssr } = require('@ecomplus/storefront-renderer/functions/')

exports.handler = (event, context, callback) => {
  const slug = event.queryStringParameters.slug

  let statusCode = 200
  const headers = {}

  const req = {
    url: slug.charAt(0) === '/' ? slug : `/${slug}`
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

  ssr(req, res)
}
