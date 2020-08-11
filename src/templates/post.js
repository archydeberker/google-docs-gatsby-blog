import React from "react"
import Layout from "../components/layout"

export default ({ data }) => (
  <Layout location="test" title={data.site.siteMetadata.title}>
    <h1>{data.post.document.name}</h1>
    {/* <p>{post.document.createdTime}</p> */}
    <div
      dangerouslySetInnerHTML={{ __html: data.post.childMarkdownRemark.html }}
    />
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
    site {
      siteMetadata {
        title
      }
    }
  }
`
