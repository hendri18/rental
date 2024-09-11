<template>
  <v-container>
    <v-card>
      <v-card-title>Histori Peminjaman</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Search"
          class="mb-4"
        ></v-text-field>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          item-value="name"
          :search="search"
          @update:options="loadItems"
        ></v-data-table-server>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      itemsPerPage: 5,
      headers: [
        { title: 'ID', key: 'id', align: 'end' },
        { title: 'Merek', key: 'brand', align: 'end' },
        { title: 'Model', key: 'model', align: 'end' },
        { title: 'Tanggal Mulai', key: 'start_date', align: 'end' },
        { title: 'Tanggal Selesai', key: 'end_date', align: 'end' },
        { title: 'Tanggal Pengembalian', key: 'return_date', align: 'end' },
        { title: 'Total Hari', key: 'total_days', align: 'end' },
        { title: 'Total Harga', key: 'total_price', align: 'end' },
      ],
      serverItems: [],
      loading: true,
      totalItems: 0,
      search: '',
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
      const response = await api.getOrderHistory(params)
      this.serverItems = response.items.data
      this.totalItems = response.total
      this.loading = false
    },
  },
}
</script>