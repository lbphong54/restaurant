import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "../components/layout/DefaultLayout.vue";
import HomePage from "../page/HomePage.vue";
import RestaurantPage from '../page/RestaurantPage.vue';
import AboutPage from '../page/AboutPage.vue';
import ContactPage from '../page/ContactPage.vue';
import BlogPage from '../page/BlogPage.vue';
import RestaurantDetailPage from '../page/RestaurantDetailPage.vue';

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
                path: 'restaurant',
                name: 'restaurant',
                component: RestaurantPage,
            },
            {
                path: 'about',
                name: 'about',
                component: AboutPage,
            },
            {
                path: 'contact',
                name: 'contact',
                component: ContactPage,
            },
            {
                path: 'blog',
                name: 'blog',
                component: BlogPage,
            },
            {
                path: 'restaurantdetail',
                name: 'restaurantdetail',
                component: RestaurantDetailPage,
            },
        ]
    }];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

export default router;