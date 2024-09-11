<template>
  <v-container class="fill-height bg-orange-darken-1" fluid>
		<v-responsive class="fill-height">
      <v-form v-model="isFormValid" @submit.prevent="register">
			
        <div class="text-h4 text-center my-4"><router-link to="/" class="text-decoration-none text-white">Rental Mobil</router-link></div>
        <v-card class="mx-auto pa-12 pt-2 pb-8" elevation="8" max-width="448" rounded="lg">

          <v-card-title class="text-center">Registrasi</v-card-title>
          <v-divider class="py-2"></v-divider>

          <div class="text-subtitle-1 text-medium-emphasis pt-2">Email</div>
          <v-text-field density="compact" placeholder="Email" variant="outlined" v-model="email" hide-details="auto" :rules="[rules.required, rules.email]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Nama</div>
          <v-text-field density="compact" placeholder="Nama" variant="outlined" v-model="name" hide-details="auto" :rules="[rules.required]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Alamat</div>
          <v-textarea density="compact" placeholder="Alamat" variant="outlined" v-model="address" hide-details="auto" :rules="[rules.required]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">No. Telepon</div>
          <v-text-field density="compact" placeholder="No. Telepon" variant="outlined" v-model="phone_number" hide-details="auto" :rules="[rules.required]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">No. SIM</div>
          <v-text-field density="compact" placeholder="No. SIM" variant="outlined" v-model="license_number" hide-details="auto" :rules="[rules.required]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Password</div>
          <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact" placeholder="Password" variant="outlined" v-model="password" :rules="[rules.required]" @click:append-inner="visible = !visible" />

          <v-btn class="my-5" color="orange-darken-1" size="large" variant="tonal" type="submit" block >
            Registrasi
          </v-btn>

          <v-card-text class="text-center">
            <router-link class="text-orange-darken-1 text-decoration-none" to="/login" rel="noopener noreferrer">
              Login <v-icon icon="mdi-chevron-right"></v-icon>
            </router-link>
          </v-card-text>
        </v-card>
      </v-form>
		</v-responsive>
  </v-container>
</template>
<script setup>
  import Swal from 'sweetalert2';
  import auth from '@/services/auth';
</script>
<script>
  export default {
    data: () => ({
      isFormValid: false,
      visible: false,
      email: '',
      password: '',
      name: '',
      address: '',
      phone_number: '',
      license_number: '',
      rules: {
        required: value => !!value || 'Required',
        email: value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid Email Address'
      },
    }),
    methods: {
      async register (event) {
        if (!this.isFormValid) return;
        const action = await auth.register({
          email: this.email,
          password: this.password,
          name: this.name,
          address: this.address,
          phone_number: this.phone_number,
          license_number: this.license_number,
        });
        if (action) {
          Swal.fire({
            text: 'Registrasi berhasil, silahkan login.',
            icon: 'success',
            customClass: {
              confirmButton: 'confirm-button-class',
            }
          }).then(() => {
            this.$router.push('/login')
          })
        }
      },
    }
  }
</script>