import axios from 'axios';

const api = axios.create({
   baseURL: 'http://192.168.88.252:3333', // usar ip da maquina
});

export default api; 