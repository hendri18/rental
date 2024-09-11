<template>
    <v-container>
      <v-card>
        <v-card-title>Data Mobil</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8"><v-btn class="bg-green" @click="openDialog">Tambah</v-btn></v-col>
            <v-col cols="12" md="4">
              <v-text-field
              v-model="search"
              label="Search"
              class="mb-4"
              hide-details
            ></v-text-field>
            </v-col>
          </v-row>
          
          
          <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="serverItems"
            :items-length="totalItems"
            :loading="loading"
            item-value="name"
            :search="search"
            @update:options="loadItems"
          >
          <template v-slot:item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="openDialog(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog v-model="createEditDialog" max-width="600">
      <v-form v-model="isFormValid" @submit.prevent="createEditItem">
        <v-card prepend-icon="mdi-car" :title="item_id ? 'Edit' : 'Tambah'">
          <v-card-text>
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Merek</div>
            <v-text-field density="compact" placeholder="Merek" variant="outlined" v-model="brand" hide-details="auto" :rules="[rules.required]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Model</div>
            <v-text-field density="compact" placeholder="Model" variant="outlined" v-model="model" hide-details="auto" :rules="[rules.required]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Plat Nomor</div>
            <v-text-field density="compact" placeholder="Plat Nomor" variant="outlined" v-model="plate_number" hide-details="auto" :rules="[rules.required]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Tarif Perhari</div>
            <v-text-field type="number" density="compact" placeholder="Tarif Perhari" variant="outlined" v-model="rental_rate" hide-details="auto" :rules="[rules.required]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Gambar</div>
            <v-file-input density="compact" variant="outlined" accept="image/*" :label="image_url ?? 'Upload Gambar'" @change="handleInputFile"></v-file-input>
            <a v-if="image_url" :href="image_url" target="_blank">Lihat Gambar</a>
          </v-card-text>
          <v-divider></v-divider>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <v-btn text="Batal" variant="plain" @click="createEditDialog = false"></v-btn>
            <v-btn color="primary" text="Simpan" variant="tonal" type="submit"></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </template>
  
  <script>
  import api from '@/services/api';
import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        itemsPerPage: 5,
        headers: [
          { title: 'ID', key: 'id', align: 'end' },
          { title: 'Merek', key: 'brand', align: 'end' },
          { title: 'Model', key: 'model', align: 'end' },
          { title: 'Plat Nomor', key: 'plate_number', align: 'end' },
          { title: 'Tarif Perhari', key: 'rental_rate', align: 'end' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        serverItems: [],
        loading: true,
        totalItems: 0,
        search: '',
        createEditDialog: false,
        isFormValid: false,
        rules: {
          required: value => !!value || 'Required',
          email: value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid Email Address'
        },
        brand: '',
        model: '',
        plate_number: '',
        rental_rate: '',
        image: null,
        item_id: null,
        image_url: '',
      }
    },
    methods: {
      async loadItems ({ page, itemsPerPage, sortBy }) {
        this.loading = true
        const sortField = sortBy[0];
        const sortOrder = sortBy[0] ? "desc" : "asc";
        const params = {
          page: page,
          itemsPerPage: itemsPerPage,
          sortField: sortField,
          sortOrder: sortOrder,
          search: this.search,
        }
        const response = await api.getCarsAdmin(params)
        this.serverItems = response.items.data
        this.totalItems = response.total
        this.loading = false
      },
      openDialog(item = null) {
        
        if (item != null) {
          this.brand = item.brand;
          this.model = item.model;
          this.plate_number = item.plate_number;
          this.rental_rate = item.rental_rate;
          this.image_url = item.image_url;
          this.item_id = item.id;
        }
        this.createEditDialog = true;
      },
      handleInputFile(event){
        this.image = event.target.files[0];
      },
      async createEditItem(){
        if (!this.isFormValid) return;
        const formData = new FormData();
        if (this.image != null) {
          formData.append('image', this.image);
        }
        formData.append('brand', this.brand);
        formData.append('model', this.model);
        formData.append('plate_number', this.plate_number);
        formData.append('rental_rate', this.rental_rate);
        const response = this.item_id ? await api.updateCarsAdmin(formData, this.item_id) : await api.createCarsAdmin(formData);
        
        if (response) {
          this.createEditDialog = false;
          Swal.fire({
            text: 'Data berhasil dibuat.',
            icon: 'success',
            customClass: {
              confirmButton: 'confirm-button-class',
            }
          }).then(() => {
            location.reload()
          })
        }
      },
      async deleteItem(item){
        Swal.fire({
          text: `Apakah kamu yakin akan menghapus ${item.brand}?`,
          icon: 'warning',
          showCancelButton: true,
          customClass: {
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class',
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await api.deleteCarsAdmin(item.id);
            location.reload()
          }
        })
      },
    },
  }
  </script>