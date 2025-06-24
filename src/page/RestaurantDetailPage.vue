<template>
    <section class="product-details spad" v-if="restaurant">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <div class="product__details__img">
                        <div class="product__details__big__img">
                            <img class="big_img" src="img/shop/details/product-big-1.jpg" alt="">
                        </div>
                        <div class="product__details__thumb">
                            <div class="pt__item active">
                                <img data-imgbigurl="img/shop/details/product-big-2.jpg"
                                    src="img/shop/details/product-big-2.jpg" alt="">
                            </div>
                            <div class="pt__item">
                                <img data-imgbigurl="img/shop/details/product-big-1.jpg"
                                    src="img/shop/details/product-big-1.jpg" alt="">
                            </div>
                            <div class="pt__item">
                                <img data-imgbigurl="img/shop/details/product-big-4.jpg"
                                    src="img/shop/details/product-big-4.jpg" alt="">
                            </div>
                            <div class="pt__item">
                                <img data-imgbigurl="img/shop/details/product-big-3.jpg"
                                    src="img/shop/details/product-big-3.jpg" alt="">
                            </div>
                            <div class="pt__item">
                                <img data-imgbigurl="img/shop/details/product-big-5.jpg"
                                    src="img/shop/details/product-big-5.jpg" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="product__details__text">
                        <div class="product__label">Cupcake</div>
                        <h4>{{ restaurant.name }}</h4>
                        <h5>{{ restaurant.price_range }}</h5>

                        <ul>
                            <li>Địa chỉ: <span>{{ restaurant.address }}</span></li>
                            <li>Điện thoại: <span>{{ restaurant.phone }}</span></li>
                        </ul>
                        <div class="product__details__option">
                            <div class="quantity">
                            </div>
                            <a class="primary-btn"><router-link to="/reservation">Đặt bàn</router-link></a>

                        </div>
                    </div>
                </div>
            </div>
            <div class="product__details__tab">
                <div class="col-lg-12">
                    <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-toggle="tab" href="#tabs-1" role="tab">Description</a>
                        </li>

                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tabs-1" role="tabpanel">
                            <div class="row d-flex justify-content-center">
                                <div class="col-lg-8">
                                    <p>{{ restaurant.description || 'Không có mô tả.' }}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
    <div v-else-if="loading" class="text-center py-5">Đang tải...</div>
    <div v-else class="text-center py-5 text-danger">Không tìm thấy nhà hàng</div>
    <!-- Shop Details Section End -->
    <div class="reviews">
        <h3>Đánh giá</h3>

        <!-- Danh sách đánh giá -->
        <!-- Đánh giá từng cái một -->
        <div v-if="currentReview">
            <div class="review">
                <strong>{{ currentReview.customer.full_name }}</strong> – ⭐ {{ currentReview.rating }}
                <p>{{ currentReview.comment }}</p>
                <small>{{ new Date(currentReview.created_at).toLocaleString() }}</small>
            </div>

            <div class="review-navigation">
                <button @click="prevReview" :disabled="currentIndex === 0">Trước</button>
                <button @click="nextReview" :disabled="!hasNext">Tiếp</button>
            </div>
        </div>

        <div v-else>Chưa có đánh giá nào.</div>

        <!-- Form viết đánh giá -->
        <div v-if="isLoggedIn" class="review-form">
            <h4>Viết đánh giá</h4>
            <select v-model="rating">
                <option disabled value="">Chọn số sao</option>
                <option v-for="n in 5" :value="n" :key="n">{{ n }} sao</option>
            </select>
            <textarea v-model="comment" placeholder="Nội dung đánh giá..."></textarea>
            <button @click="submitReview">Gửi đánh giá</button>
        </div>
        <div v-else>
            <em>Bạn cần đăng nhập để gửi đánh giá.</em>
        </div>
    </div>
    <!-- Related Products Section Begin -->
    <section class="related-products spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <div class="section-title">
                        <h2>Bạn có thể thích</h2>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3" v-for="item in relatedRestaurants" :key="item.id">
                    <div class="product__item">
                        <div class="product__item__pic set-bg" :data-setbg="item.image || 'img/shop/product-1.jpg'">
                            <div class="product__label">
                                <span>{{ item.name }}</span>
                            </div>
                        </div>
                        <div class="product__item__text">
                            <h6>
                                <router-link :to="`/restaurantdetail/${item.id}`">{{ item.name }}</router-link>
                            </h6>
                            <div class="product__item__price">{{ item.price_range }}</div>
                            <div class="cart_add">
                                <router-link :to="`/restaurantdetail/${item.id}`" class="add-to-cart">Đặt
                                    bàn</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Related Products Section End -->
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
    props: ['id'],
    data() {
        return {
            restaurant: null,
            loading: true,
            relatedRestaurants: [],
            reviews: [],
            rating: '',
            comment: '',
            currentIndex: 0,
        };
    },
    setup() {
        const route = useRoute();
        const restaurantId = route.params.id;
        // ...
        return { restaurantId };
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            handler(newId) {
                this.loading = true;
                axios.get(`http://localhost:8000/api/restaurants/${newId}`)
                    .then(res => {
                        this.restaurant = res.data.data;
                        return axios.get(`http://localhost:8000/api/restaurants/${newId}/related`);
                    })
                    .then(res => {
                        this.relatedRestaurants = res.data.data;
                    })
                    .catch(err => {
                        console.error('Lỗi khi lấy chi tiết nhà hàng hoặc sản phẩm liên quan:', err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        }
    },

    computed: {
        isLoggedIn() {
            return localStorage.getItem('token') !== null;
        },
        currentReview() {
            return this.reviews[this.currentIndex] || null;
        },
        hasNext() {
            return this.currentIndex < this.reviews.length - 1;
        },
    },
    mounted() {
        // const id = this.$route.params.id;
        // console.log('ID lấy từ route:', id);
        // axios.get(`http://localhost:8000/api/restaurants/${id}`)
        //     .then(res => {
        //         this.restaurant = res.data.data;
        //         // Gọi tiếp API lấy sản phẩm liên quan
        //         return axios.get(`http://localhost:8000/api/restaurants/${id}/related`);
        //     })
        //     .then(res => {
        //         this.relatedRestaurants = res.data.data;
        //     })
        //     .catch(err => {
        //         console.error('Lỗi khi lấy chi tiết nhà hàng hoặc sản phẩm liên quan:', err);
        //     })
        //     .finally(() => {
        //         this.loading = false;
        //     });
        this.fetchReviews();
    },

    methods: {
        async fetchReviews() {
            const res = await axios.get(`http://localhost:8000/api/restaurants/${this.restaurantId}/reviews`);
            this.reviews = res.data?.data;
            console.log("🚀 ~ fetchReviews ~ res:", res.data.data)
            this.currentIndex = 0;
        },
        async submitReview() {
            try {
                await axios.post(
                    `http://localhost:8000/api/restaurants/${this.restaurantId}/reviews`,
                    { 
                        rating: this.rating, comment: this.comment 
                    },
                    { 
                        withCredentials: true
                    }
                );
                this.rating = '';
                this.comment = '';
                this.fetchReviews();
                alert("Đánh giá đã gửi!");
            } catch (e) {
                alert("Gửi đánh giá thất bại.");
            }
        },
        nextReview() {
            if (this.hasNext) {
                this.currentIndex++;
            }
        },
        prevReview() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        },
    },



};
</script>

<style>
.product__details__option {
    display: flex;
    justify-content: center;
}

.reviews {
    padding: 16px;
    background: #fefefe;
    border: 1px solid #eee;
    border-radius: 8px;
}

.review {
    margin-bottom: 12px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 8px;
}

.review-form {
    margin-top: 16px;
}

textarea,
select {
    width: 100%;
    padding: 8px;
    margin-bottom: 8px;
}

.review-navigation {
    margin-top: 12px;
}

.review-navigation button {
    margin-right: 8px;
    padding: 6px 12px;
}
</style>