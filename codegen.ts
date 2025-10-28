import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.BACKEND_API_URL ?? "http://localhost:3000/api/graphql",
  documents: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  // ignoreNoDocuments: true,
  generates: {
    "./__generated__/": { preset: "client", plugins: [], config: { useTypeImports: true } },
  },
};
export default config;
