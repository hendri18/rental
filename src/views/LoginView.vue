<template>
  <v-container class="fill-height bg-orange-darken-1" fluid>
		<v-responsive class="fill-height">
      <v-form v-model="isFormValid" @submit.prevent="login">
			
        <div class="text-h4 text-center my-4"><router-link to="/" class="text-decoration-none text-white">Rental Mobil</router-link></div>
        <v-card class="mx-auto pa-12 pt-2 pb-8" elevation="8" max-width="448" rounded="lg">

          <v-card-title class="text-center">Login</v-card-title>
          <v-divider class="py-2"></v-divider>

          <div class="text-subtitle-1 text-medium-emphasis pt-2">Email</div>
          <v-text-field density="compact" prepend-inner-icon="mdi-email-outline" placeholder="Email" variant="outlined" v-model="email" hide-details="auto" :rules="[rules.required, rules.email]" />
          <div class="text-subtitle-1 text-medium-emphasis pt-2">Password</div>
          <v-text-field prepend-inner-icon="mdi-lock-outline" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact" placeholder="Password" variant="outlined" v-model="password" :rules="[rules.required]" @click:append-inner="visible = !visible" />

          <v-btn class="my-5" color="orange-darken-1" size="large" variant="tonal" type="submit" block >
            Login
          </v-btn>

          <v-card-text class="text-center">
            <router-link class="text-orange-darken-1 text-decoration-none" to="/register" rel="noopener noreferrer">
              Registrasi <v-icon icon="mdi-chevron-right"></v-icon>
            </router-link>
          </v-card-text>
        </v-card>
      </v-form>
		</v-responsive>
  </v-container>
</template>
<script setup>
  import auth from '@/services/auth';
</script>
<script>
  export default {
    data: () => ({
      isFormValid: false,
      visible: false,
      email: '',
      password: '',
      rules: {
        required: value => !!value || 'Required',
        email: value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid Email Address'
      },
    }),
    methods: {
      async login (event) {
        if (!this.isFormValid) return;
        const action = await auth.login({
          email: this.email,
          password: this.password,
        });
        if (action) {
          if (action.role === 'admin') {
            this.$router.push('/dashboard')
          } else {
            this.$router.push('/')
          }
        }
      },
    }
  }
</script>