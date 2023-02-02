<template>
  <div>
    <h3>Admin Dashboard</h3>

    <v-table fixed-header height="300px">
      <thead>
        <tr>
          <th class="text-left">email</th>
          <th class="text-left">name</th>
          <th class="text-left">isAdmin</th>
          <th class="text-left">AccessLevel</th>
          <th class="text-left">uid</th>
          <th class="text-left">verified</th>
          <th class="text-left">actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="currentUser in allUsers" :key="currentUser.uid">
          <td>{{ currentUser.email }}</td>
          <td>{{ currentUser.name }}</td>
          <td>{{ currentUser.isAdmin }}</td>
          <td>{{ currentUser.accessLevel }}</td>
          <td>{{ currentUser.uid }}</td>
          <td>{{ currentUser.emailVerified }}</td>
          <td>
            <v-btn
              class="pa-0"
              min-width="32px"
              x-small
              variant="text"
              title="Promote to Admin"
              :class="isAdmin ? 'error-text' : 'primary-text'"
              @click="() => setAdmin(currentUser.email, !currentUser.isAdmin)"
            >
              <v-icon>mdi-shield-crown-outline</v-icon>
            </v-btn>
            <v-btn
              class="pa-0"
              min-width="32px"
              x-small
              variant="text"
              title="Promote Access Level"
              @click="
                () =>
                  setAccessLevel(currentUser.email, currentUser.accessLevel + 1)
              "
            >
              <v-icon>mdi-chevron-triple-up</v-icon>
            </v-btn>
            <v-btn
              class="pa-0"
              min-width="32px"
              x-small
              variant="text"
              title="Demote Access Level"
              @click="
                () =>
                  setAccessLevel(currentUser.email, currentUser.accessLevel - 1)
              "
            >
              <v-icon>mdi-chevron-triple-down</v-icon>
            </v-btn>
            <v-btn
              class="pa-0"
              min-width="32px"
              x-small
              variant="text"
              title="Delete"
              @click="() => deleteUser(currentUser.email)"
            >
              <v-icon>mdi-cancel</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
//execute every time an instance of the component is created.
import { ref, onBeforeMount } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { db } from "@/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { isAdmin } from "@firebase/util";

const userStore = useUserStore();
const router = useRouter();
const isAuth = computed(() => userStore.isAuth);
const user = computed(() => userStore.getUser);
const allUsers = computed(() => userStore.getAllUsers);

const setAdmin = async (email: string, isAdmin: boolean) => {
  if (!email) return;
  const res = (await userStore.setAdmin(email, isAdmin)) as any;
  if (res) {
    const admin = { isAdmin: res.admin };
    const docRef = doc(db, `users/${email}`);
    await updateDoc(docRef, admin);
    userStore.updateUser(email, admin);
  }
};
const setAccessLevel = async (email: string, level: number) => {
  if (!email && level >= 0 && level <= 10) return;
  const res = (await userStore.setAccessLevel(email, level)) as any;
  if (res?.level) {
    const lvl = { accessLevel: res.level };
    const docRef = doc(db, `users/${email}`);
    await updateDoc(docRef, lvl);
    userStore.updateUser(email, lvl);
  }
};

const deleteUser = async (email: string) => {
  const res = (await userStore.deleteUser(email)) as any;
  if (res) {
    // const docRef = doc(db, `users/${email}`);
    // await deleteDoc(docRef);
    userStore.removeUser(email);
  }
};

onBeforeMount(() => {
  userStore.fetchAllUsers();
});
</script>

<script lang="ts"></script>
