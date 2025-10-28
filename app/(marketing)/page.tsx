import { graphql } from "@/__generated__";
import { gqlFetch } from "@/lib/gql";
import { HomeClient } from '#components/home-client';

/**
 * Server component that fetches media data at build time
 */
export default async function Page() {
  const MediaQuery = graphql(`
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

  const data = await gqlFetch(MediaQuery, { limit: 20 }, { revalidate: 60, withCredentials: true });

  return <HomeClient mediaData={data} />
}