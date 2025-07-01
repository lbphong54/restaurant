<template>
  <section class="product-details spad" v-if="restaurant">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="product__details__img">
            <div class="product__details__big__img">
              <img class="big_img" :src="restaurant.avatar ? restaurant.avatar : '/default.jpg'" alt="Ảnh nhà hàng" />
            </div>
            <div class="product__details__thumb">
              <div class="pt__item active"
                :style="{ backgroundImage: `url(${restaurant.avatar || '/img/shop/product-1.jpg'})` }">
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
              <li>
                Địa chỉ: <span>{{ restaurant.address }}</span>
              </li>
              <li>
                Điện thoại: <span>{{ restaurant.phone }}</span>
              </li>
            </ul>

            <div class="product__details__option">
              <div class="quantity"></div>
              <router-link class="primary-btn" :to="{
                  path: '/reservation',
                  query: { restaurant_id: restaurant.id },
                }">
                Đặt bàn
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="product__details__tab">
        <div class="col-lg-12">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'description' }"
                @click.prevent="activeTab = 'description'" href="#" role="tab">Description</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'menu' }" @click.prevent="activeTab = 'menu'" href="#"
                role="tab">Menu</a>
            </li>
          </ul>

          <div class="tab-content">
            <!-- Description Tab -->
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'description' }" id="tabs-1"
              role="tabpanel">
              <div class="row d-flex justify-content-center">
                <div class="col-lg-8">
                  <p>{{ restaurant.description || "Không có mô tả." }}</p>
                </div>
              </div>
            </div>

            <!-- Menu Tab -->
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'menu' }" id="tabs-2" role="tabpanel">
              <div v-if="restaurant.menu_images && restaurant.menu_images.length">
                <div v-for="(img, index) in restaurant.menu_images" :key="index" class="mb-4">
                  <img :src="getMenuImage(img)" alt="Ảnh thực đơn" class="menu-img img-fluid rounded shadow" />
                </div>
              </div>
              <p v-else>Không có ảnh thực đơn.</p>
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
    <!-- Đánh giá từng cái một -->
    <div v-if="loadingReviews" class="text-center">Đang tải đánh giá...</div>
    <template v-else>
      <div v-if="reviews.length > 0" class="d-flex flex-wrap justify-content-center">
        <div class="col-lg-6 mb-4" v-for="review in reviews" :key="review.id">
          <div class="testimonial__item">
            <div class="testimonial__author">
              <div class="testimonial__author__pic">
                <img :src="
                    review.customer.avatar || '/img/testimonial/default.jpg'
                  " alt="Avatar" />
              </div>
              <div class="testimonial__author__text">
                <h5>{{ review.customer.full_name }}</h5>
              </div>
            </div>

            <div class="rating">
              <span v-for="n in Math.floor(review.rating)" :key="n" class="icon_star"></span>
              <span v-if="review.rating % 1 >= 0.5" class="icon_star-half_alt"></span>
            </div>

            <p>{{ review.comment }}</p>
            <small class="d-block mt-2 text-muted">{{
              new Date(review.created_at).toLocaleString()
              }}</small>
          </div>
        </div>
      </div>

      <div v-else class="text-center w-100">Chưa có đánh giá nào.</div>

      <!-- Phân trang -->
      <div class="col-12 mt-3" v-if="reviewsPagination.last_page > 1">
        <nav class="review-pagination d-flex justify-content-center flex-wrap gap-2">
          <button v-for="link in reviewsPagination.links" :key="link.label" :disabled="!link.url" v-html="link.label"
            @click="changeReviewPage(extractPage(link.url))" :class="['btn-page', { active: link.active }]"></button>
        </nav>
      </div>
    </template>

    <!-- Form viết đánh giá -->
    <div v-if="isLoggedIn" class="review-form">
      <h4>Viết đánh giá</h4>
      <select v-model="rating">
        <option disabled value="">Chọn số sao</option>
        <option v-for="n in 5" :value="n" :key="n">{{ n }} sao</option>
      </select>
      <textarea v-model="comment" placeholder="Nội dung đánh giá..."></textarea>
      <button class="btn btn-primary" @click="submitReview">
        Gửi đánh giá
      </button>
    </div>
    <div v-else>
      <em>Bạn cần đăng nhập để gửi đánh giá.</em>
    </div>
  </div>
  <!-- Related -->
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
            <div class="product__item__pic" :style="{ backgroundImage: `url(${getRestaurantImage(item.avatar)})` }">
              <div class="product__label">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="product__item__text">
              <h6>
                <router-link :to="`/restaurantdetail/${item.id}`">{{
                  item.name
                  }}</router-link>
              </h6>
              <div class="product__item__price">{{ item.price_range }}</div>
              <div class="cart_add">
                <router-link :to="`/restaurantdetail/${item.id}`" class="add-to-cart">Đặt bàn</router-link>
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
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  props: ["id"],
  data() {
    return {
      restaurant: null,
      loading: true,
      activeTab: 'description',
      relatedRestaurants: [],
      rating: "",
      comment: "",
      currentIndex: 0,
      reservations: [],
      selectedReservationId: "",
      reviews: [],
      tables: [],
      reviewsPagination: {
        current_page: 1,
        per_page: 5,
        last_page: 1,
        total: 0,
        links: [],
      },
      loadingReviews: false,
    };
  },
  setup() {
    const route = useRoute();
    const restaurantId = route.params.id;
    // ...
    return { restaurantId };
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        this.loading = true;
        axios
          .get(`http://localhost:8000/api/restaurants/${newId}`)
          .then((res) => {
            this.restaurant = res.data.data;
            this.tables = res.data.data.restaurant_tables;

            return axios.get(
              `http://localhost:8000/api/restaurants/${newId}/related`
            );
          })
          .then((res) => {
            this.relatedRestaurants = res.data.data;
          })
          .catch((err) => {
            console.error(
              "Lỗi khi lấy chi tiết nhà hàng hoặc sản phẩm liên quan:",
              err
            );
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  },

  computed: {
    isLoggedIn() {
      return localStorage.getItem("token") !== null;
    },
    currentReview() {
      return this.reviews[this.currentIndex] || null;
    },
    currentReservation() {
      return this.reservations[this.currentIndex] || null;
    },
    hasNext() {
      return this.currentIndex < this.reviews.length - 1;
    },
  },
  async mounted() {
    if (this.restaurantId) {
      await this.fetchReviews(1);
    }
  },

  methods: {
    async fetchReviews(page = 1) {
      this.loadingReviews = true;
      try {
        const res = await axios.get(
          `http://localhost:8000/api/restaurants/${this.restaurantId}/reviews`,
          { params: { per_page: 5, page } }
        );
        this.reviews = res.data.data;
        // Lưu thông tin phân trang
        this.reviewsPagination = {
          current_page: res.data.current_page,
          per_page: res.data.per_page,
          last_page: res.data.last_page,
          total: res.data.total,
          links: res.data.links,
        };
      } catch (e) {
        this.reviews = [];
        this.reviewsPagination = {
          current_page: 1,
          per_page: 5,
          last_page: 1,
          total: 0,
          links: [],
        };
      }
      this.loadingReviews = false;
    },
    changeReviewPage(page) {
      if (page && page !== this.reviewsPagination.current_page) {
        this.fetchReviews(page);
      }
    },
    async submitReview() {
      this.error = "";
      if (!this.rating || !this.comment) {
        alert("Vui lòng chọn số sao và nhập nội dung đánh giá!");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Bạn chưa đăng nhập!");
          return;
        }

        // Log dữ liệu gửi lên để kiểm tra
        console.log("Gửi đánh giá:", {
          rating: this.rating,
          comment: this.comment,
        });

        await axios.post(
          `http://localhost:8000/api/restaurants/${this.restaurantId}/reviews`,
          {
            rating: this.rating,
            comment: this.comment,
            reservation_id: this.restaurantId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.rating = "";
        this.comment = "";
        await this.fetchReviews(1);
        alert("Đánh giá đã gửi!");
      } catch (e) {
        // Hiển thị lỗi chi tiết từ backend nếu có
        if (e.response && e.response.data) {
          console.error("Lỗi backend:", e.response.data);
          if (e.response.data.errors) {
            const errors = e.response.data.errors;
            alert(Object.values(errors).flat().join("\n"));
          } else if (e.response.data.message) {
            alert(e.response.data.message);
          } else {
            alert("Gửi đánh giá thất bại (500).");
          }
        } else {
          alert("Gửi đánh giá thất bại (500).");
        }
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
    goToReservation() {
      const restaurantId = this.$route.params.id; // lấy từ URL /restaurantdetail/7

      this.$router.push({
        path: "reservation",
        query: { restaurant_id: restaurantId },
      });
    },
    extractPage(url) {
      if (!url) return null;
      const match = url.match(/page=(\d+)/);
      return match ? parseInt(match[1]) : null;
    },

      getRestaurantImage(avatar) {
      if (Array.isArray(avatar)) avatar = avatar[0];
      if (!avatar) return '/img/shop/product-1.jpg';
      return avatar;
    },

    getMenuImage(menu) {
      if (Array.isArray(menu)) menu = menu[0];
      if (!menu) return '/img/shop/product-1.jpg';
      return menu;
    }

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

.review-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-item {
  background: #f8fafe;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 15px;
  border: 1px solid #ececec;
  box-shadow: 0 1px 2px rgba(30, 60, 90, 0.04);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  margin-bottom: 2px;
}

.review-rating {
  color: #ffb400;
  font-size: 15px;
  font-weight: 500;
}

.review-body {
  color: #444;
  font-size: 14px;
  margin-bottom: 0;
  line-height: 1.4;
}

.review-footer {
  text-align: right;
  color: #888;
  font-size: 12px;
  margin-top: 0;
}

.review-pagination {
  margin-top: 12px;
  text-align: center;
}

.review-pagination .navBtn {
  margin: 0 2px;
  padding: 4px 10px;
  border: none;
  background: #f6f8fa;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 15px;
}

.review-pagination .navBtn.active,
.review-pagination .navBtn:disabled {
  background: #1890ff;
  color: #fff;
  cursor: default;
}

.no-review {
  text-align: center;
  color: #888;
  padding: 16px 0;
}

.primary-btn {
  display: inline-block;
  background: linear-gradient(to right, #009688, #e67c1b);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.primary-btn:hover {
  background: linear-gradient(to right, #00796b, #cf6c14);
  transform: translateY(-2px);
  color: #fff;
}

.btn btn-primary {
  display: inline-block;
  background: linear-gradient(to right, #009688, #e67c1b);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.btn btn-primary:hover {
  background: linear-gradient(to right, #00796b, #cf6c14);
  transform: translateY(-2px);
  color: #fff;
}

.review-pagination .btn-page {
  background: #fff;
  border: 1px solid #ccc;
  padding: 6px 14px;
  min-width: 36px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
}

.review-pagination .btn-page:hover:not(:disabled) {
  background: #e67c1b;
  color: #fff;
  border-color: #e67c1b;
}

.review-pagination .btn-page.active {
  background: #009688;
  color: #fff;
  border-color: #009688;
  font-weight: 600;
}

.review-pagination .btn-page:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.review-form {
  background: #fdfdfd;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.review-form label {
  font-weight: 600;
  color: #444;
}

.review-form select,
.review-form textarea {
  border-radius: 8px;
  font-size: 15px;
}

.review-form textarea::placeholder {
  color: #aaa;
}

.review-form .primary-btn {
  display: inline-block;
  background: linear-gradient(to right, #009688, #e67c1b);
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.review-form .primary-btn:hover {
  background: linear-gradient(to right, #00796b, #cf6c14);
  transform: translateY(-1px);
}

.product__item__pic {
  width: 100%;
  height: 220px;
  /* hoặc chiều cao bạn muốn */
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  background-color: #f6f6f6;
}

img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-row {
  display: flex;
  justify-content: center;
  /* Căn giữa các hình */
  gap: 16px;
  /* Khoảng cách giữa các hình */
  flex-wrap: wrap;
  /* Đảm bảo không bị tràn nếu màn hình nhỏ */
}

.menu-img {
  width: 45%;
  /* Hoặc đặt kích thước cố định như 300px */
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

</style>
