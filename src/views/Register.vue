<template>
  <v-card variant="tonal" max-width="500px">
    <v-card-text>
      <p v-if="!!error" class="text-error">Error: {{ error }}</p>
      <v-text-field
        ref="nameTextfield"
        label="Display Name"
        v-model="name"
        :rules="[rules.required]"
      />
      <v-text-field
        ref="emailTextfield"
        label="Email"
        v-model="email"
        :rules="[rules.required, rules.email]"
      />
      <v-text-field
        ref="passTextfield"
        label="Password"
        v-model="password"
        type="password"
        :rules="[rules.required, rules.min6]"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="() => register(email, password, name)"
        :disabled="!inputValid"
      >
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
//execute every time an instance of the component is created.
import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { computed } from "vue";
const userStore = useUserStore();
const router = useRouter();

// TODO: Figure out how to get Vuetify Textfield's validation state, reliably
// This is temporary workaround:
const inputValid = computed(() => {
  let e = rule2bool(rules.email(email.value));
  let p = password.value.length > 5;
  let n = name.value.length > 0;
  e = e && email.value.length > 0;
  return e && p && n;
});
//
const email = ref("");
const password = ref("");
const name = ref("");
const error = ref("");

//
async function register(email: string, password: string, name: string) {
  const errmsg = await userStore.register(email, password, name);
  if (!errmsg && userStore.isAuth) {
    router.push("/");
  } else {
    console.warn(errmsg);
    error.value = errmsg;
  }
}
</script>

<script lang="ts">
//only executes once when the component is first imported
const rules = {
  required: (value: string) => !!value || "Required.",
  min6: (value: string) => value.length >= 6 || "Min 6 characters",
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid e-mail.";
  },
};
function rule2bool(ruleResult: string | true): boolean {
  if (typeof ruleResult == "string") {
    return false;
  }
  return true;
}
</script>
