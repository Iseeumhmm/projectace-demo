import { MarketingLayout } from '#components/layout'
import { graphql } from "@/__generated__";
import { gqlFetch } from "@/lib/gql";

export default function Layout(props: { children: React.ReactNode }) {
  const PostsQuery = graphql( `
    query AllMedia {
      allMedia {
        docs {
          id
          alt
          url
          filename
          mimeType
          width
          height
          createdAt
        }
        totalDocs
        hasNextPage
      }
    }
  `);
    
      gqlFetch(PostsQuery, { limit: 20 }, { revalidate: 60, withCredentials: true }).then(data => {
        console.log(data);
      });

  return <MarketingLayout>{props.children}</MarketingLayout>
}
