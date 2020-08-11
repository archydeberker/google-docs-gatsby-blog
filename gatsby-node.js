const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

require("dotenv").config({
  path: `.env`,
})

exports.createPages = async ({ graphql, actions }) =>
  graphql(
    `
      {
        allGoogleDocs {
          nodes {
            document {
              path
            }
          }
        }
      }
    `
  ).then(result => {
    result.data.allGoogleDocs.nodes.forEach(({ document }, index) => {
      actions.createPage({
        path: document.path,
        component: path.resolve(`./src/templates/post.js`),
      })
    })
  })
