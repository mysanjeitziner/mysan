
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  buckets: {
    "mysan-media": {
      access: "public_read",
    },
  },
});
