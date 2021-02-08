import axios from 'axios';

const client = axios.create({
  baseURL: 'http://fe-test.guardtime.com',
  timeout: 5000,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

export default client;
