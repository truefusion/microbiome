import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import '@mdi/font/css/materialdesignicons.css';
import './styles/base.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
