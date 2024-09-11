import axios from "axios"
import storage from "./storage"
import auth from "./auth";

const BASE_URL = import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:8000/api'
const api = {
    getCars: async (params) => {
        try {
            const result = await axios.get(BASE_URL+'/cars', {params: params});
            if (result.data.status === 'success') {
                return result.data.data;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    placeOrder: async (payload) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.post(BASE_URL+'/order', payload, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    returnCar: async (payload) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.post(BASE_URL+'/return-car', payload, config);
            if (result.data.status === 'success') {
                return result.data.data;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    getOrderHistory: async (params) => {
        try {
            const token = auth.getToken();
            if (!token) return true;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
            };
            const result = await axios.get(BASE_URL+'/order-history', config);
            if (result.data.status === 'success') {
                return result.data.data;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    getCarsAdmin: async (params) => {
        try {
            const token = auth.getToken();
            if (!token) return true;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
            };
            const result = await axios.get(BASE_URL+'/admin/cars', config);
            if (result.data.status === 'success') {
                return result.data.data;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    createCarsAdmin: async (payload) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'multipart/form-data'
        };
        try {
            const result = await axios.post(BASE_URL+'/admin/cars', payload, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    updateCarsAdmin: async (payload, id) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'multipart/form-data'
        };
        try {
            const result = await axios.post(BASE_URL+'/admin/cars/'+id, payload, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    deleteCarsAdmin: async (id) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.delete(BASE_URL+'/admin/cars/'+id, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    getUsersAdmin: async (params) => {
        try {
            const token = auth.getToken();
            if (!token) return true;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
            };
            const result = await axios.get(BASE_URL+'/admin/users', config);
            if (result.data.status === 'success') {
                return result.data.data;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    createUsersAdmin: async (payload) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.post(BASE_URL+'/admin/users', payload, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    updateUsersAdmin: async (payload, id) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.post(BASE_URL+'/admin/users/'+id, payload, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    deleteUsersAdmin: async (id) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.delete(BASE_URL+'/admin/users/'+id, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    getCustomersAdmin: async (params) => {
        try {
            const token = auth.getToken();
            if (!token) return true;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
            };
            const result = await axios.get(BASE_URL+'/admin/customers', config);
            if (result.data.status === 'success') {
                return result.data.data;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    updateCustomersAdmin: async (payload, id) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.post(BASE_URL+'/admin/customers/'+id, payload, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    deleteCustomersAdmin: async (id) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.delete(BASE_URL+'/admin/customers/'+id, config);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },

    updateUser: async (payload, id) => {
        const token = auth.getToken();
        if (!token) return true;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            const result = await axios.post(BASE_URL+'/users/'+id, payload, config);
            if (result.data.status === 'success') {
                const resp = result.data.data;
                const getUser = auth.userData();
                getUser.email = resp.email;
                getUser.customer = resp.customer;
                const user = storage.store("user", updatedUser);
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            if (error.status == 401) {
                storage.remove("user")
            }
            return null;
        }
    },
    
}

export default api;