<template>
  <div>
    dashboard
    {{ isAuth }}
  </div>
</template>

<script setup lang="ts">
//execute every time an instance of the component is created.
import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { computed } from "vue";
const userStore = useUserStore();
const router = useRouter();
const isAuth = computed(() => userStore.isAuth);
</script>

<script lang="ts"></script>
