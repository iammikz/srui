import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  // Keep the "use client" directive in the bundle — see implementation plan §1.5.
  banner: {
    js: '"use client";',
  },
});
