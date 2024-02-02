import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  // this build is configured to standalone web usage (vue included)
  // when targeting npm module vue has to moved to external;
  // TODO: prepare separate build configurations, or find solution for vue reference sharing
  //        possible solution might be to include imgo-connect into report server client library and just set imgo url when initializing
  build: {
    target: "es2019",
    minify: true,
    sourcemap: true,
    lib: {
      entry: "src/router.ts",
      name: "MiniRouter",
      formats: ["umd"],
      fileName: (format) => `mini-router-${format}.js`,
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
}));
