<template>
  <v-app>
    <v-main>
      <nav>
        <span v-if="!isAuth">
          <router-link to="/login">login</router-link> |
          <router-link v-show="!isAuth" to="/register">register</router-link>
          |
        </span>
        <span v-else>
          <router-link v-show="isAuth" to="/" @click="logout"
            >logout
          </router-link>
          |
        </span>

        <router-link to="/dashboard">dashboard</router-link>
      </nav>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { computed } from "vue";
const userStore = useUserStore();
const isAuth = computed(() => userStore.isAuth);
const logout = userStore.logout;
</script>
