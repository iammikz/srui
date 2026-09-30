// Type .mdx modules: default component + frontmatter export (remark-mdx-frontmatter).
declare module "*.mdx" {
  import type { ComponentType } from "react";
  const component: ComponentType;
  export const frontmatter: { title: string; description?: string };
  export default component;
}
