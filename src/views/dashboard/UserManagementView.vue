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
        <v-card prepend-icon="mdi-account" :title="item_id ? 'Edit' : 'Tambah'">
          <v-card-text>
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Email</div>
            <v-text-field density="compact" placeholder="Email" variant="outlined" v-model="email" hide-details="auto" :rules="[rules.required, rules.email]" />
            <div class="text-subtitle-1 text-medium-emphasis pt-2">Password</div>
            <v-text-field density="compact" placeholder="Password" variant="outlined" v-model="password" hide-details="auto" :rules="!item_id ? [rules.required] : []"/>
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
          { title: 'Email', key: 'email', align: 'end' },
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
        email: '',
        password: '',
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
        const response = await api.getUsersAdmin(params)
        this.serverItems = response.items.data
        this.totalItems = response.total
        this.loading = false
      },
      openDialog(item = null) {
        
        if (item != null) {
          this.email = item.email;
          this.password = item.password;
          this.item_id = item.id;
        }
        this.createEditDialog = true;
      },
      async createEditItem(){
        if (!this.isFormValid) return;
        const payload = this.item_id ? { email: this.email } : { email: this.email, password: this.password };
        const response = this.item_id ? await api.updateUsersAdmin(payload, this.item_id) : await api.createUsersAdmin(payload);
        
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
          text: `Apakah kamu yakin akan menghapus ${item.email}?`,
          icon: 'warning',
          showCancelButton: true,
          customClass: {
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class',
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await api.deleteUsersAdmin(item.id);
            location.reload()
          }
        })
      },
    },
  }
  </script>