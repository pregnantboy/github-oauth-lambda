const https = require('https')
const qs = require('querystring')

const config = {
  'oauth_client_id': process.env.CLIENT_ID,
  'oauth_client_secret': process.env.CLIENT_SECRET,
  'oauth_host': 'github.com',
  'oauth_port': 443,
  'oauth_path': '/login/oauth/access_token',
  'oauth_method': 'POST',
  'cors_origin': process.env.CORS_ORIGIN || '*'
}

function authenticate(code) {
  const data = qs.stringify({
    client_id: config.oauth_client_id,
    client_secret: config.oauth_client_secret,
    code: code
  })

  const reqOptions = {
    host: config.oauth_host,
    port: config.oauth_port,
    path: config.oauth_path,
    method: config.oauth_method,
    headers: { 'content-length': data.length }
  }

  let body = ''

  return new Promise((resolve, reject) => {
    const req = https.request(reqOptions, function (res) {
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        resolve(qs.parse(body).access_token)
      })
    })
    req.write(data)
    req.end()
    req.on('error', (e) => {
      reject(e)
    })
  })
}

function sendRes(status, body) {
  const response = {
    isBase64Encoded: false,
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': config.cors_origin
    },
    body: JSON.stringify(body)
  };
  return response;
}

exports.handler = async (event) => {
  try {
    const token = await authenticate(event.pathParameters.code)
    if (!token) {
      throw new Error('Invalid code')
    }
    return sendRes(200, { token })
  } catch (e) {
    return sendRes(401, { message: e.message })
  }
}