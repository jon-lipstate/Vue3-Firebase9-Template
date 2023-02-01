/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import fireAuth from "./fireAuth";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  // Warning: Router depends on Pinia & fireAuth depends on Pinia
  app.use(vuetify).use(pinia).use(router).use(fireAuth);
}
