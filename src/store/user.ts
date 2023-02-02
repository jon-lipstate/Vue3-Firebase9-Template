import { defineStore } from "pinia";
//
import {
  createUserWithEmailAndPassword,
  ParsedToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  terminate,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
//
import { auth, functions, db } from "@/firebase-config";
//
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      /** @type User | null */
      user: null,
      /** @type ParsedToken | null */
      claims: null,
      /**@type:any */
      allUsers: null,
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
    isAdmin(state) {
      return state.claims.admin;
    },
    getAllUsers(state) {
      return state.allUsers;
    },
  },
  actions: {
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
        setTimeout(() => this.updateAccount(email, { name }), 2000);
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
      // Important: fireAuth Plugin is what sets the user in the store
      await signOut(auth);
    },
    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
    //ADMIN Calls
    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
    async setAdmin(email: string, isAdmin: boolean) {
      const fn = httpsCallable(functions, "setAdmin");
      const result = await fn({ email, isAdmin });
      return result?.data;
    },
    async setAccessLevel(email: string, level: number) {
      const fn = httpsCallable(functions, "setAccessLevel");
      const result = await fn({ email, level });
      return result?.data;
    },
    async fetchAllUsers() {
      this.allUsers = [];
      if (!this.claims.admin) {
        this.allUsers = null;
      } else {
        console.log("fetchAllUsers");
        const usersRef = collection(db, "users");
        const docs = await getDocs(usersRef);
        docs.forEach((d) => this.allUsers.push(d.data()));
        // // terminate(db);
      }
    },
    async deleteUser(email: string) {
      const fn = httpsCallable(functions, "deleteUser");
      const result = await fn({ email });
      return result?.data;
    },
    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
    // db activities
    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
    updateAccount(email: string, items: any) {
      const userDoc = doc(db, `users`, email);
      updateDoc(userDoc, items);
      // terminate(db);
    },
    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
    updateUser(email: string, items: any) {
      const index = this.allUsers.findIndex((x: any) => x.email == email);
      if (index < 0) {
        console.error(`Bad Index for ${email}`);
      } else this.allUsers[index] = { ...this.allUsers[index], ...items };
    },
    removeUser(email: string) {
      const index = this.allUsers.findIndex((x: any) => x.email == email);
      if (index < 0) {
        console.error(`Bad Index for ${email}`);
      } else this.allUsers.splice(index, 1);
    },
  },
});
