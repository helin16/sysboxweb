// Same rules as before the Next.js 16 upgrade ("next/core-web-vitals"),
// in ESLint's newer flat-config format.
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    // Tests stand in for next/document with plain <html>/<head> elements.
    files: ["tests/**"],
    rules: { "@next/next/no-head-element": "off" },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "test-results/**",
      "playwright-report/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
