<template>
    <v-container>
      <v-card>
        <v-card-title>Data Pelanggan</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8"></v-col>
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
        <v-card prepend-icon="mdi-account" :title="item_id ? 'Edit' : 'Tambah'">
          <v-card-text>
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Name</div>
            <v-text-field density="compact" placeholder="Name" variant="outlined" v-model="name" hide-details="auto" :rules="[rules.required]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Alamat</div>
            <v-textarea density="compact" placeholder="Alamat" variant="outlined" v-model="address" hide-details="auto" :rules="[rules.required]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">No. Telp</div>
            <v-text-field density="compact" placeholder="No. Telp" variant="outlined" v-model="phone_number" hide-details="auto" :rules="[rules.required]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">No. SIM</div>
            <v-text-field type="number" density="compact" placeholder="No. SIM" variant="outlined" v-model="license_number" hide-details="auto" :rules="[rules.required]" />
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
          { title: 'Nama', key: 'name', align: 'end' },
          { title: 'Alamat', key: 'address', align: 'end' },
          { title: 'No. Telepon', key: 'phone_number', align: 'end' },
          { title: 'No. SIM', key: 'license_number', align: 'end' },
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
        name: '',
        address: '',
        phone_number: '',
        license_number: '',
        item_id: null,

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
        const response = await api.getCustomersAdmin(params)
        this.serverItems = response.items.data
        this.totalItems = response.total
        this.loading = false
      },
      openDialog(item = null) {
        
        if (item != null) {
          this.name = item.name
          this.address = item.address
          this.phone_number = item.phone_number
          this.license_number = item.license_number
          this.item_id = item.id;
        }
        this.createEditDialog = true;
      },
      handleInputFile(event){
        this.image = event.target.files[0];
      },
      async createEditItem(){
        if (!this.isFormValid) return;
        const payload = {
          name: this.name,
          address: this.address,
          phone_number: this.phone_number,
          license_number: this.license_number,
        }
        const response = await api.updateCustomersAdmin(payload, this.item_id);
        
        if (response) {
          this.createEditDialog = false;
          Swal.fire({
            text: 'Data berhasil disimpan.',
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
            const response = await api.deleteCustomersAdmin(item.id);
            location.reload()
          }
        })
      },
    },
  }
  </script>