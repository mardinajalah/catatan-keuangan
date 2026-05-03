import axios from 'axios';

// Gunakan IP WiFi lokal komputer agar bisa diakses baik dari Emulator maupun HP Fisik
const BASE_URL = 'http://192.168.100.111:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
