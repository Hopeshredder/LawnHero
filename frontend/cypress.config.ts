import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config
    },
    baseUrl: "http://localhost:5173"
  }
});