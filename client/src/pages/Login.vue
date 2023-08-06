<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 80vh;">
    <q-toolbar class="shadow-2 bg-primary text-white">

      <div style="font-size: 24px; margin-left: 16px;">INVENTORY APP</div>
      <q-space />
    </q-toolbar>
    <div class="row column" style="width: 300px; margin: auto; height: 300px;">
      <div class="page-title" style="margin-bottom: 20px;">Login</div>
      <q-form
        @submit="login"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="username"
          label="Username"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please enter username']"
        />

        <q-input
          filled
          v-model="password"
          label="Password"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type a password']"
          :type="isPwd ? 'password' : 'text'"
        >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
        </q-input>

        <div>
          <q-btn :loading="loading" label="Login" type="submit" color="primary"/>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import axios from 'axios';
import { Cookies } from "quasar";

export default defineComponent({
  name: 'LoginPage',

  data() {
    return {
      url: `${process.env.API_HOST}/api/login`,
      $q: useQuasar(),
      username: ref(null),
      password: ref(null),
      isPwd: ref(true),
      loading: ref(false),
    }
  },
  methods: {
    warning(text) {
      this.$q.notify(
        {
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: text,
        }
      );
    },
    login: async function() {
      this.loading = true;

      const loginUrl = this.url;
      const username = this.username;
      const password = this.password;

      await axios.post(loginUrl, { username, password })
      .then(res => {
        if(res.data.token) {
          Cookies.set('inventoryAuth', res.data.token);
          this.$router.push('/itemlist');
        } else {
          this.warning('Login Failed');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error');
        } else {
          this.warning('Login Failed');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 900);
      })
    },
  },
})
</script>
