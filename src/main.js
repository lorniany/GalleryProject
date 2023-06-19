import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import Vuesax from 'vuesax-alpha'
import 'vuesax-alpha/dist/index.css'

const pinia = createPinia()

createApp(App).use(Vuesax, {}).use(pinia).mount('#app')

// createApp(App).mount('#app')