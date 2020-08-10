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

const {google} = require("googleapis")

const {
  convertGoogleDocumentToJson,
  convertJsonToMarkdown,
} = require("./converters")

const {googleAuth} = require("./google-auth")

const {fetchGoogleDriveFiles} = require("./google-drive")

async function fetchGoogleDocs({id}) {
  const auth = googleAuth.getAuth()
  return new Promise((resolve, reject) => {
    google
      .docs({
        version: "v1",
        auth,
      })
      .documents.get(
        {
          documentId: id,
        },
        (err, res) => {
          if (err) {
            return reject(err)
          }

          if (!res.data) {
            return reject("Empty data")
          }

          resolve(convertGoogleDocumentToJson(res.data))
        }
      )
  })
}

async function fetchGoogleDocsDocuments(pluginOptions) {
  const googleDriveFiles = await fetchGoogleDriveFiles(pluginOptions)
  return Promise.all(
    googleDriveFiles.map(async file => {
      const {cover, content} = await fetchGoogleDocs({
        id: file.id,
      })
      const markdown = convertJsonToMarkdown({
        metadata: _objectSpread(
          _objectSpread({}, file),
          {},
          {
            cover,
          }
        ),
        content,
      })

      const document = _objectSpread(
        _objectSpread({}, file),
        {},
        {
          cover,
          content,
          markdown,
        }
      )

      return document
    })
  )
}

module.exports = {
  fetchGoogleDocsDocuments,
}
