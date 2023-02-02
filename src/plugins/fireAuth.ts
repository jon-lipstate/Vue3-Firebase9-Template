import type { App } from "vue";
import { useUserStore } from "@/store/user";

import { auth } from "@/firebase-config";
// This file auto-triggers store updates on auth state changes
export default {
  install: (app: App) => {
    const userStore = useUserStore();

    new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          // console.log("Auth State changed, User: ", user);
          if (user) {
            const tokenResult = await user.getIdTokenResult();
            const claims = tokenResult.claims;
            return resolve(
              userStore.setAuth(user, {
                admin: claims.admin,
                accessLevel: claims.accessLevel,
                // other: claims,
              })
            );
          }
          return resolve(userStore.clearAuth());
        } catch (e) {
          console.error("fireAuth error", e);
        }
      });
    });
  },
};
