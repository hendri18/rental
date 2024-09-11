
<template>
  <v-app-bar
    color="orange-darken-1"
    prominent
  >
    <v-app-bar-nav-icon class="hidden-sm-and-up" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <v-toolbar-title>Rental Mobil</v-toolbar-title>

    <v-spacer></v-spacer>

    <template v-if="$vuetify.display.smAndUp">
      <v-toolbar-items>
        <v-btn to="/home">Home</v-btn>
        <template v-if="isLoggedIn">
          <v-btn @click="handleReturnCarDialog">Pengembalian</v-btn>
          <v-btn to="/order-history">Histori Peminjaman</v-btn>
          <v-btn @click="handleProfileDialog">Profile</v-btn>
        </template>
        <template v-else>
          <v-btn to="/login">Login</v-btn>
          <v-btn to="/register">Register</v-btn>
        </template>
      </v-toolbar-items>
    </template>
    <v-menu v-if="isLoggedIn && user">
      <template v-slot:activator="{ props }">
        <v-btn prepend-icon="mdi-account-circle" v-bind="props"></v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title><v-icon icon="mdi-account"></v-icon> {{ user.customer.name }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title><router-link class="text-decoration-none text-black" to="/logout">Logout</router-link></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer">
    <v-list> 
      <v-list-item to="/home">Home</v-list-item>
      <template v-if="isLoggedIn">
        <v-list-item @click="handleReturnCarDialog">Pengembalian</v-list-item>
        <v-list-item to="/order-history">Histori Peminjaman</v-list-item>
        <v-list-item @click="handleProfileDialog">Profile</v-list-item>
      </template>
      <template v-else>
        <v-list-item to="/login">Login</v-list-item>
        <v-list-item to="/register">Register</v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="returnCarDialog" max-width="600">
    <v-card prepend-icon="mdi-car" title="Pengembalian">
      <v-card-text>
        
        <v-form v-model="isFormValid" @submit.prevent="submitReturnCar">
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Plat Nomor</div>
          <v-text-field density="compact" placeholder="Plat Nomor" variant="outlined" v-model="plate_number" hide-details="auto" :rules="[rules.required]" />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Batal" variant="plain" @click="returnCarDialog = false"></v-btn>
        <v-btn color="primary" text="Kembalikan" variant="tonal" @click="submitReturnCar"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="profileDialog" max-width="600">
    
    <v-card prepend-icon="mdi-account" title="User">
      <v-card-text>
        
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Email</div>
          <v-text-field readonly="" density="compact" placeholder="Email" variant="outlined" v-model="user.email" hide-details="auto" :rules="[rules.required, rules.email]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Nama</div>
          <v-text-field readonly="" density="compact" placeholder="Nama" variant="outlined" v-model="user.customer.name" hide-details="auto" :rules="[rules.required]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Alamat</div>
          <v-textarea readonly="" density="compact" placeholder="Alamat" variant="outlined" v-model="user.customer.address" hide-details="auto" :rules="[rules.required]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">No. Telepon</div>
          <v-text-field readonly="" density="compact" placeholder="No. Telepon" variant="outlined" v-model="user.customer.phone_number" hide-details="auto" :rules="[rules.required]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">No. SIM</div>
          <v-text-field readonly="" density="compact" placeholder="No. SIM" variant="outlined" v-model="user.customer.license_number" hide-details="auto" :rules="[rules.required]" />
        </v-card-text>
        <v-divider></v-divider>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-btn text="Tutup" variant="plain" @click="profileDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script setup>
import api from '@/services/api';
import auth from '@/services/auth';
import Swal from 'sweetalert2';

const isLoggedIn = auth.isLoggedIn();
const user = auth.userData();
</script>
<script>
  export default {
    data: () => ({
      drawer: false,
      returnCarDialog: false,
      profileDialog: false,
      isFormValid: false,
      isProfileFormValid: false,
      plate_number: '',
      rules: {
        required: value => !!value || 'Required',
        email: value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid Email Address'
      },
      user: {
        email: '',
        customer: {},
      },
      password: '',
    }),
    methods: {
      handleReturnCarDialog(){
        this.returnCarDialog = true
      },
      handleProfileDialog(){
        this.profileDialog = true;
        this.user = auth.userData();
      },
      async submitReturnCar(){
        if (!this.isFormValid) return;
        const response = await api.returnCar({plate_number: this.plate_number});
        if (response) {
          console.log(response)
          this.returnCarDialog = false;
          Swal.fire({
            title: 'Mobil berhasil Dikembalikan',
            html: `<div style="text-align: left"><p>Total Hari: ${response.total_days} <small>(Terhitung 1 hari dari tanggal peminjaman)</small></p><br><p>Total Harga: <b>Rp. ${new Intl.NumberFormat('id-ID').format(parseInt(response.total_price))}</b></p></div>`,
            icon: 'success',
            customClass: {
              confirmButton: 'confirm-button-class',
            }
          }).then(() => {
            location.reload()
          });
        }
      },
    }
  }
</script>