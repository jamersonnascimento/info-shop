// Configuração do Axios para comunicação com a API
import axios from 'axios';

// Importante: Ao usar o Expo Go em um dispositivo físico, precisamos usar o IP da máquina
// onde o servidor está rodando, não 'localhost', pois 'localhost' no dispositivo
// se refere ao próprio dispositivo, não ao computador onde a API está rodando

// Obtenha o IP da sua máquina na rede local (exemplo: 192.168.1.149)
// Este é o mesmo IP que aparece no QR code do Expo
const API_IP = '192.168.1.149'; // Substitua pelo IP da sua máquina na rede
const API_PORT = '8080';
const BASE_URL = `http://${API_IP}:${API_PORT}/api`;

// Criando uma instância do Axios com configurações base
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // Timeout de 30 segundos para dar mais tempo para a conexão
});

// Interceptor para requisições
api.interceptors.request.use(
  config => {
    console.log(`Requisição para: ${config.url}`);
    return config;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  response => {
    console.log(`Resposta de: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  error => {
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
      console.error('Erro na resposta:', error.response.status, error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas nenhuma resposta foi recebida
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição que acionou um erro
      console.error('Erro na configuração da requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;