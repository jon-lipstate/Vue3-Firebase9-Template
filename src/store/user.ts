import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  ParsedToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/firebase-config";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      /** @type User | null */
      user: null,
      /** @type ParsedToken | null */
      claims: null,
    };
  },
  persist: {
    afterRestore: (ctx) => {
      // console.log("afterRestore", ctx.store.$id);
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    isAuth(state) {
      return !!state.user;
    },
  },
  actions: {
    // any amount of arguments, return a promise or not
    // you can directly mutate the state
    clearAuth() {
      this.user = null;
    },
    setAuth(user: User, claims: ParsedToken) {
      this.user = user;
      this.claims = claims;
    },
    async register(
      email: string,
      password: string,
      name: string
    ): Promise<string> {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        updateProfile(credential.user, { displayName: name });
        // this.user = credential.user;
      } catch (e: any) {
        console.error(e);
        return e.code?.split("/")[1];
      }
    },
    async login(email: string, password: string): Promise<string> {
      // Important: fireAuth Plugin is what sets the user in the store
      let error = "";
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        error = e.code?.split("/")[1];
      }
      return error;
    },
    async logout() {
      await signOut(auth);
    },
  },
});
