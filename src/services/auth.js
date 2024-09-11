import axios from "axios"
import storage from "../services/storage"
import Swal from "sweetalert2"
const BASE_URL = import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:8000/api'
const auth = {
    login: async (payload) => {
        try {
            const result = await axios.post(BASE_URL+'/login', payload);
            if (result.data.status === 'success') {
                const user = storage.store("user", result.data.data);
                return user;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            return null;
        }
    },
    register: async (payload) => {
        try {
            const result = await axios.post(BASE_URL+'/register', payload);
            if (result.data.status === 'success') {
                return true;
            }
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            return null;
        }
    },
    logout: async () => {
        try {
            const token = auth.getToken();
            if (!token) return false;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const result = await axios.post(BASE_URL+'/logout', {}, config);
            storage.remove("user")
            return null;
        } catch (error) {
            alert(error.response && error.response.data ? error.response.data.message : error)
            console.error(error)
            return null;
        }
        
    },
    userData: () => {
        const user = storage.get("user");
        return user;
    },
    isLoggedIn: () => {
        const user = storage.get("user");
        return user ? true : false;
    },
    isAdmin: () => {
        const user = storage.get("user");
        if (!user) return null;
        return user.role == 'admin';
    },
    getToken: () => {
        const user = storage.get("user");
        if (!user) return null;
        return user.access_token;
    }
}

export default auth;