import React from "react"
import Layout from "../components/layout"

export default ({ data: { post } }) => (
  <Layout location="test" title="Happier Lives Institute">
    <h1>{post.document.name}</h1>
    {/* <p>{post.document.createdTime}</p> */}
    <div dangerouslySetInnerHTML={{ __html: post.childMarkdownRemark.html }} />
  </Layout>
)

export const query = graphql`
  query($path: String) {
    post: googleDocs(document: { path: { eq: $path } }) {
      document {
        name
        createdTime
      }
      childMarkdownRemark {
        html
      }
    }
  }
`
