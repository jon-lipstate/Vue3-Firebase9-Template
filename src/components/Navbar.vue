<template>
  <v-app-bar :elevation="2" density="compact" class="px-1">
    <!-- <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template> -->

    <v-app-bar-title>
      <router-link to="/">Template</router-link>
    </v-app-bar-title>

    <template v-slot:append>
      <span v-if="isAuth">{{ user.email }}</span>
      <v-btn
        title="Login"
        v-if="!isAuth"
        icon="mdi-login-variant"
        to="login"
      ></v-btn>
      <v-btn
        title="Logout"
        v-else
        icon="mdi-logout-variant"
        @click="logout"
      ></v-btn>
      <v-btn
        title="Admin Dashboard"
        v-if="isAuth && isAdmin"
        icon="mdi-crown-outline"
        to="dashboard"
      >
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
// import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { computed } from "vue";
const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);
const isAuth = computed(() => userStore.isAuth);
const user = computed(() => userStore.getUser);
const logout = userStore.logout;
</script>
