<template>
  <q-toolbar class="shadow-2 bg-primary text-white">
    <q-tabs shrink v-model="tab">
      <q-route-tab name="tab1" label="Item List" to="/itemlist" />
      <q-route-tab name="tab2" label="Set List" to="/setlist" />
      <q-route-tab name="tab3" label="Set Details" to="/setdetailslist" />
      <q-route-tab name="tab4" label="Add Item" to="/additem" />
      <q-route-tab name="tab5" label="Add Set" to="/addset" />
    </q-tabs>
    <q-space />
    <q-breadcrumbs active-color="white" style="font-size: 16px">
      <q-breadcrumbs-el label="USER" icon="account_box" />
      <q-breadcrumbs-el :label="user" />
    </q-breadcrumbs>

    <q-space />
    <q-tabs shrink indicator-color="transparent">
      <q-route-tab label="Logout" @click="logout" to="/login" />
    </q-tabs>
  </q-toolbar>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { Cookies } from "quasar";
import axios from 'axios';
import setToken from '../helpers/setToken';

export default defineComponent ({
  data() {
    return {
      deptUrl: `${process.env.API_HOST}/api/getDept`,
      categoryUrl: `${process.env.API_HOST}/api/getCategory`,
      token: setToken().token,
    }
  },
  setup() {
    const user = setToken().user;

    return {
      user,
      tab: ref(''),
    }
  },
  methods: {
    async setDeptList() {
      await axios.get(this.deptUrl, { headers: {"Authorization" : `Bearer ${this.token}`} })
      .then(res => {
        if(res.status === 200 && res.data) {
          this.$store.commit('setDeptList', res.data);
        }
      })
    },
    async setCatList() {
      await axios.get(this.categoryUrl, { headers: {"Authorization" : `Bearer ${this.token}`} })
      .then(res => {
        if(res.status === 200 && res.data) {
          this.$store.commit('setCatList', res.data);
        }
      })
    },
    logout() {
      Cookies.remove('inventoryAuth');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.setDeptList();
    this.setCatList();
  },
})
</script>
