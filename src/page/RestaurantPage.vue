<template>
    <section class="shop spad">
        <div class="container">
            <div class="shop__option">
                <div class="row">
                    <div class="col-lg-7 col-md-7">
                        <div class="shop__option__search">
                            <form action="#">
                                <select>
                                    <option value="">Categories</option>
                                    <option value="">Red Velvet</option>
                                    <option value="">Cup Cake</option>
                                    <option value="">Biscuit</option>
                                </select>
                                <input type="text" placeholder="Search">
                                <button type="submit"><i class="fa fa-search"></i></button>
                            </form>
                        </div>
                    </div>
                    <div class="col-lg-5 col-md-5">
                        <div class="shop__option__right">
                            <select>
                                <option value="">Default sorting</option>
                                <option value="">A to Z</option>
                                <option value="">1 - 8</option>
                                <option value="">Name</option>
                            </select>
                            <a href="#"><i class="fa fa-list"></i></a>
                            <a href="#"><i class="fa fa-reorder"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-3 col-md-6 col-sm-6" v-for="item in restaurants" :key="item.id">
                    <div class="product__item">
                        <div class="product__item__pic set-bg" :data-setbg="item.image || 'img/shop/product-1.jpg'">
                            <div class="product__label">
                                <span>{{ item.name }}</span>
                            </div>
                        </div>
                        <div class="product__item__text">
                            <h6>
                                <strong>{{ item.name }}</strong> - {{ item.address }} - {{ item.phone }}
                            </h6>
                            <div class="product__item__price">{{ item.price_range ? `$${item.price_range}` : '' }}</div>
                            <div class="cart_add">
                                <router-link :to="`/restaurantdetail/${item.id}`" class="add-to-cart">Đặt
                                    bàn</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="shop__last__option">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="shop__pagination">
                            <a href="#">1</a>
                            <a href="#">2</a>
                            <a href="#">3</a>
                            <a href="#"><span class="arrow_carrot-right"></span></a>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="shop__last__text">
                            <p>Showing 1-9 of 10 results</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            restaurants: [],
            loading: true,


        };
    },

    mounted() {
        const restaurants_types = this.$route.query.restaurants_types;
        // Gọi API restaurants với tham số lọc theo loại
        axios.get('http://localhost:8000/api/restaurants', {
            params: {
                restaurants_types // truyền tham số lọc
            }
        })
            .then(res => {
                console.log('Dữ liệu trả về:', res.data);
                this.restaurants = res.data.data.data || [];
            })
            .catch(err => {
                console.error('Lỗi khi lấy danh sách nhà hàng:', err)
            })
            .finally(() => {
                this.loading = false
            })
    },

    beforeUnmount() {
        clearInterval(this.timer);
    },


};
</script>

<style></style>