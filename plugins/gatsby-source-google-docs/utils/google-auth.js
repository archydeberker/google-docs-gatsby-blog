function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        )
      })
    }
  }
  return target
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {}
  var target = _objectWithoutPropertiesLoose(source, excluded)
  var key, i
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source)
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i]
      if (excluded.indexOf(key) >= 0) continue
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue
      target[key] = source[key]
    }
  }
  return target
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {}
  var target = {}
  var sourceKeys = Object.keys(source)
  var key, i
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i]
    if (excluded.indexOf(key) >= 0) continue
    target[key] = source[key]
  }
  return target
}

// const fs = require("fs")
// const path = require("path")
const {google} = require("googleapis") // const googledocsPath = path.join(process.cwd(), ".google")
// const tokenPath = path.join(googledocsPath, "token.json")

const token_fields = [
  "client_id",
  "client_secret",
  "access_token",
  "refresh_token",
  "scope",
  "token_type",
  "expiry_date",
]

const isScopeValid = scope =>
  [
    "https://www.googleapis.com/auth/documents.readonly",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
  ].every(permission => scope.includes(permission))

const isTokenValid = token =>
  token &&
  token_fields.every(field => !!token[field]) &&
  isScopeValid(token.scope)

class GoogleAuth {
  constructor() {
    // if (!fs.existsSync(googledocsPath)) {
    //   fs.mkdirSync(googledocsPath)
    // }
    const _this$getToken = this.getToken(),
      {client_id, client_secret} = _this$getToken,
      token = _objectWithoutProperties(_this$getToken, [
        "client_id",
        "client_secret",
      ])

    const auth = new google.auth.OAuth2(client_id, client_secret)
    auth.setCredentials(token)
    let expired = true

    if (token.expiry_date) {
      const nowDate = new Date()
      const expirationDate = new Date(token.expiry_date)
      expired = expirationDate.getTime() < nowDate.getTime()
    }

    if (expired) {
      auth.on("tokens", refreshedToken => {
        this.setToken(
          _objectSpread(
            {
              client_id,
              client_secret,
            },
            refreshedToken
          )
        )
        auth.setCredentials({
          refresh_token: refreshedToken.refresh_token,
        })
      })
    }

    this.auth = auth
  }

  getToken() {
    if (this.token) {
      return this.token
    }

    let token

    if (process.env.GATSBY_SOURCE_GOOGLE_DOCS_TOKEN) {
      token = JSON.parse(process.env.GATSBY_SOURCE_GOOGLE_DOCS_TOKEN)
    }

    if (!token) {
      throw new Error(
        "No token. Please generate one using `gatsby-source-google-docs-token` command"
      )
    }

    if (!isTokenValid(token)) {
      throw new Error(
        "Invalid token. Please regenerate one using `gatsby-source-google-docs-token` command"
      )
    }

    this.token = token
    return this.token
  }

  setToken(token) {
    if (isTokenValid(token)) {
      this.token = token
    }
  }

  getAuth() {
    return this.auth
  }

  setAuth(auth) {
    this.auth = auth
  }
}

let googleAuth = new GoogleAuth()
module.exports = {
  googleAuth,
}
