<template>
  <v-layout full-height>
    <v-app-bar color="grey-darken-3" prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Admin Panel Rental Mobil</v-toolbar-title>
      <v-menu v-if="isLoggedIn && user">
        <template v-slot:activator="{ props }">
          <v-btn prepend-icon="mdi-account-circle" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title><v-icon icon="mdi-account"></v-icon> {{ user.email }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title><router-link class="text-decoration-none text-black" to="/logout">Logout</router-link></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer permanent color="grey-darken-2" v-model="drawer">
      <v-list>
        <v-list-item title="Data Mobil" to="/dashboard/data-car"></v-list-item>
        <v-list-item title="Data Rental" to="/dashboard/data-order"></v-list-item>
        <v-list-item title="User Management" to="/dashboard/user-management"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>
<script setup>
import auth from '@/services/auth';

const isLoggedIn = auth.isLoggedIn();
const user = auth.userData();
</script>
<script>
  export default {
    data: () => ({
      drawer: true,
    }),
    mounted () {
      this.drawer = this.$vuetify.display.smAndUp;
    },
  }
</script>
  