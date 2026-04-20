import next from "eslint-config-next/core-web-vitals";

const config = [
  ...next,
  {
    ignores: ["node_modules/**", ".next/**", "dist/**", "*.tsbuildinfo"],
  },
];

export default config;
