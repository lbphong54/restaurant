import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "../components/layout/DefaultLayout.vue";
import HomePage from "../page/HomePage.vue";
import AboutPage from '../page/AboutPage.vue';
import ContactPage from '../page/ContactPage.vue';
import BlogPage from '../page/BlogPage.vue';
import RestaurantDetailPage from '../page/RestaurantDetailPage.vue';
import LoginPage from '../page/LoginPage.vue';
import RegisterPage from '../page/RegisterPage.vue';
import RestaurantPage from '../page/RestaurantPage.vue';
import ReservationPage from "../page/ReservationPage.vue";
import HistoryPage from "../page/HistoryPage.vue";
import QrPage from "../page/QrPage.vue";
import ProfilePage from "../page/ProfilePage.vue";

const routes = [
    {
        path: "/",
        component: DefaultLayout,
        children: [
            {
                path: "",
                name: "home",
                component: HomePage,
            },
            {
                path: '/restaurant',
                name: 'RestaurantPage',
                component: RestaurantPage,
            },
            {
                path: "about",
                name: "about",
                component: AboutPage,
            },
            {
                path: "contact",
                name: "contact",
                component: ContactPage,
            },
            {
                path: "blog",
                name: "blog",
                component: BlogPage,
            },
            {
                path: "restaurantdetail/:id",
                name: "RestaurantDetail",
                component: RestaurantDetailPage,
            },
            {
                path: "login",
                name: "login",
                component: LoginPage,
            },
            {
                path: "signup",
                name: "signup",
                component: RegisterPage,
            },
            {
                path: 'reservation',
                name: 'ReservationPage',
                component: ReservationPage,
            },
            {
                path: 'history',
                name: 'history',
                component: HistoryPage,
            },
            {
                path: 'qrpay',
                name: 'qrpay',
                component: QrPage,
            },
            {
                path: 'profile',
                name: 'profile',
                component: ProfilePage,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

export default router;