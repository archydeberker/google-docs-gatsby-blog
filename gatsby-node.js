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

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
