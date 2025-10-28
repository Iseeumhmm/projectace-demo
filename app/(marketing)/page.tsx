import { graphql } from "@/__generated__";
import { gqlFetch } from "@/lib/gql";
import { HomeClient } from '#components/home-client';
import { getAuthToken } from '@/lib/auth';

export default async function Page() {
  const MediaQuery = graphql(`
    query AllPages {
      Pages {
        docs { 
          id
          title
          slug
          layout {
            __typename
            ... on FAQBlock {
              id
              blockName
              blockType
              title
              faqs {
                id
                question
                answer
              }
            }
          }
          authors {
            __typename
          }
          createdAt
          updatedAt
        }
        totalDocs
        hasNextPage
      }
    }
  `);

  const token = await getAuthToken();
  const data = await gqlFetch(MediaQuery, { limit: 20 }, { revalidate: 60, token });

  return <HomeClient mediaData={data} />
}