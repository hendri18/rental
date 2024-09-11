<template>
  <v-form v-model="isFormValid">
    <v-container>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-date-input label="Tanggal Mulai" v-model="start_date" hide-details required></v-date-input>
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-date-input label="Tanggal Selesai" v-model="end_date" hide-details required></v-date-input>
            </v-col>

            <v-col
              cols="12"
              md="4"
              align-self="center"
            >
              <v-btn class="bg-orange-darken-1" block prepend-icon="mdi-magnify" @click="getCarByDate">
                Cari
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <br>
      <v-divider :thickness="2"></v-divider>
      <br>
      <v-row>
        <v-col cols="12" md="6">
          <p>Mobil yang tersedia:</p>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Cari Mobil"  
            hide-details
            variant="outlined"
            v-model="search"
            @input="filterCarsBySearch"
          ></v-text-field>
          
        </v-col>
      </v-row>
      
      <br>
      <v-row>
        <v-col cols="12" md="3" v-for="car in cars">
          <v-card>
            <v-img v-if="car.image"
              height="200px"
              :src="car.image_url"
              cover
            ></v-img>
              <v-card-title>{{ car.brand }}</v-card-title>
              <v-card-subtitle>{{ car.model }}</v-card-subtitle>
  
            <v-card-text>
              <p>Tarif Perhari: Rp. {{ new Intl.NumberFormat('id-ID').format(parseInt(car.rental_rate)) }}</p>
              <p>Plat Nomor: {{ car.plate_number }}</p>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="orange-lighten-2"
                text="Pesan"
                @click="openDetail(car)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
  </v-form>
  <v-dialog v-model="orderDialog" max-width="600">
    <v-card prepend-icon="mdi-car" title="Buat Pesanan">
      <v-card-text>
        <strong>Data Mobil:</strong>
        
        <v-table density="compact">
          <tbody>
            <tr>
              <td>Merek: </td>
              <td>{{ car.brand }}</td>
            </tr>
            <tr>
              <td>Model: </td>
              <td>{{ car.model }}</td>
            </tr>
            <tr>
              <td>Plat Nomor </td>
              <td>{{ car.plate_number }}</td>
            </tr>
            <tr>
              <td>Tarif Perhari </td>
              <td>{{ car.rental_rate }}</td>
            </tr>
          </tbody>
        </v-table>
        <strong>Data Pemesan:</strong>
        <v-table density="compact">
          <tbody>
            <tr>
              <td>Nama: </td>
              <td>{{ user.customer.name }}</td>
            </tr>
            <tr>
              <td>Alamat: </td>
              <td>{{ user.customer.address }}</td>
            </tr>
            <tr>
              <td>No. Telepon: </td>
              <td>{{ user.customer.phone_number }}</td>
            </tr>
            <tr>
              <td>No: SIM </td>
              <td>{{ user.customer.license_number }}</td>
            </tr>
            <tr>
              <td>Tanggal Mulai </td>
              <td>{{ moment(start_date).format('dddd, DD MMMM YYYY') }}</td>
            </tr>
            <tr>
              <td>Tanggal Selesai </td>
              <td>{{ moment(end_date).format('dddd, DD MMMM YYYY') }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Batal" variant="plain" @click="orderDialog = false"></v-btn>

        <v-btn color="primary" text="Pesan" variant="tonal" @click="handleOrder"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import api from '@/services/api';
import auth from '@/services/auth';
import moment from 'moment';
import Swal from 'sweetalert2';

</script>

<script>
export default {
    data() {
      return {
        isFormValid: false,
        start_date: new Date(),
        end_date: new Date(),
        search: '',
        cars: [],
        _cars: [],
        car: {},
        orderDialog: false,
        user: {},
      }
    },
    methods: {
      openDetail(car) {
        if (!auth.isLoggedIn()) {
          this.$router.push('/login')
          return
        }
        console.log(this.start_date)
        this.orderDialog = true;
        this.car = car;
        // this.$router.push({ path: `/detail/${id}`, query: { start_date: this.start_date, end_date: this.end_date }})
      },
      async handleOrder(){
        const payload = {
          car_id: this.car.id,
          start_date: moment(this.start_date).format('YYYY-MM-DD'),
          end_date: moment(this.end_date).format('YYYY-MM-DD'),
        }
        const response = await api.placeOrder(payload);
        if (response) {
          Swal.fire({
            text: 'Pesanan berhasil dibuat.',
            icon: 'success',
            customClass: {
              confirmButton: 'confirm-button-class',
            }
          });
          this.orderDialog = false
          this.car = {}
          this.getCars()
        }
      },
      async getCars(){
        const response = await api.getCars({available: 1});
        this.cars = response;
        this._cars = response;
      },
      async getCarByDate() {
        if (this.start_date > this.end_date) {
          Swal.fire({
            text: 'Tanggal Mulai tidak boleh lebih besar dari Tanggal Selesai',
            icon: 'error',
            customClass: {
              confirmButton: 'confirm-button-class',
            }
          })
          return;
        }
        const response = await api.getCars({
          available: 1, 
          start_date: moment(this.start_date).format('YYYY-MM-DD'),
          end_date: moment(this.end_date).format('YYYY-MM-DD'),
        });
        this.cars = response;
        this._cars = response;
      },
      async filterCarsBySearch(){
        this.cars = this._cars.filter(car => {
          const lowerSearch = this.search.toLowerCase()
          return car.brand.toLowerCase().includes(lowerSearch) || car.model.toLowerCase().includes(lowerSearch)
        })
      },
    },
    async mounted() {
      this.getCars()
      this.user = auth.userData();
    },
}
</script>