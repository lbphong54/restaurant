/* eslint-disable */
import './assets/css/bootstrap.min.css'
import './assets/css/flaticon.css'
import './assets/css/barfiller.css'
import './assets/css/magnific-popup.css'
import './assets/css/font-awesome.min.css'
import './assets/css/elegant-icons.css'
import './assets/css/nice-select.css'
// import './assets/css/owl.carousel.min.css'
import './assets/css/slicknav.min.css'
import './assets/css/style.css'
//-------------------------------------------


import $ from 'jquery';
window.$ = window.jQuery = $;


// ...existing code...
//-------------------------------------------
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(router)

app.mount('#app')