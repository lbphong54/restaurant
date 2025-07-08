<template>
  <section class="about spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <iframe
            width="100%"
            height="600"
            src="https://www.youtube.com/embed/GlrxcuEDyF8?si=XCUO6-z_LOuljRd-"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </section>
  <!-- About Section End -->

  <section class="about-intro spad">
    <div class="container">
      <div class="row justify-content-center text-center">
        <div class="col-lg-10">
          <div class="section-title">
            <span>Giới thiệu nền tảng</span>
            <h2>Đặt bàn dễ dàng – Trải nghiệm ẩm thực trọn vẹn</h2>
          </div>
          <p class="mb-4">
            <strong>PASGO</strong> là nền tảng đặt chỗ nhà hàng trực tuyến giúp
            kết nối hàng nghìn thực khách với các quán ăn, nhà hàng, tại Việt
            Nam. Với thao tác đơn giản, bạn có thể:
          </p>
          <ul class="text-start" style="max-width: 700px; margin: 0 auto">
            <li>
              🔍 Tìm kiếm nhà hàng theo khu vực, món ăn, phong cách phục vụ
            </li>
            <li>
              📱 Đặt bàn online chỉ với vài cú nhấp chuột, không cần gọi điện
            </li>
            <li>🎁 Nhận ưu đãi, khuyến mãi độc quyền khi đặt qua hệ thống</li>
            <li>
              ⭐ Đọc đánh giá thật từ cộng đồng để đưa ra lựa chọn đúng đắn
            </li>
          </ul>
          <p class="mt-4">
            Sứ mệnh của chúng tôi là <em>nâng cao trải nghiệm ăn uống</em> của
            người Việt – từ lúc đặt bàn đến khi thưởng thức bữa ăn.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonial Section Begin -->
  <!-- <section class="testimonial spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12 text-center">
          <div class="section-title">
            <span>Cảm nhận</span>
            <h2>Đánh giá của khách hàng</h2>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="row testimonial__slider">
          <div v-if="loadingReviews" class="text-center w-100">
            Đang tải đánh giá...
          </div>

          <template v-else>
            <div
              v-if="reviews.length > 0"
              class="d-flex flex-wrap justify-content-center"
            >
              <div
                class="col-lg-6 mb-4"
                v-for="review in reviews"
                :key="review.id"
              >
                <div class="testimonial__item">
                  <div class="testimonial__author">
                    <div class="testimonial__author__pic">
                      <img
                        :src="
                          review.customer.avatar ||
                          '/img/testimonial/default.jpg'
                        "
                        alt="Avatar"
                      />
                    </div>
                    <div class="testimonial__author__text">
                      <h5>{{ review.customer.full_name }}</h5>
                    </div>
                  </div>

                  <div class="rating">
                    <span
                      v-for="n in Math.floor(review.rating)"
                      :key="n"
                      class="icon_star"
                    ></span>
                    <span
                      v-if="review.rating % 1 >= 0.5"
                      class="icon_star-half_alt"
                    ></span>
                  </div>

                  <p>{{ review.comment }}</p>
                  <small class="d-block mt-2 text-muted">{{
                    new Date(review.created_at).toLocaleString()
                  }}</small>
                </div>
              </div>
            </div>

            <div v-else class="text-center w-100">Chưa có đánh giá nào.</div>

            <div class="col-12 mt-3" v-if="reviewsPagination.last_page > 1">
              <nav class="review-pagination text-center">
                <button
                  v-for="link in reviewsPagination.links"
                  :key="link.label"
                  :disabled="!link.url || link.active"
                  v-html="link.label"
                  @click="changeReviewPage(extractPage(link.url))"
                  :class="{ active: link.active, navBtn: true }"
                ></button>
              </nav>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section> -->
  <!-- Testimonial Section End -->

  <!-- Team Section Begin -->
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: true,
      rating: "",
      comment: "",
      selectedReservationId: "",
      reviews: [],
      loadingReviews: false,
      reviewsPagination: {
        current_page: 1,
        per_page: 5,
        last_page: 1,
        total: 0,
        links: [],
      },
    };
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
    extractPage(url) {
      if (!url) return null;
      const match = url.match(/page=(\d+)/);
      return match ? parseInt(match[1]) : null;
    },
  },
};
</script>

<style>
/* About Intro */
.about-intro {
  background: #fefefb;
  padding: 80px 0;
}

.about-intro .section-title span {
  color: #e67c1b;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.about-intro h2 {
  font-size: 32px;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 24px;
  color: #333;
}

.about-intro p {
  font-size: 16px;
  color: #555;
  line-height: 1.7;
}

.about-intro ul {
  padding-left: 0;
  list-style: none;
}

.about-intro ul li {
  position: relative;
  padding-left: 28px;
  margin-bottom: 12px;
  font-size: 16px;
  color: #444;
}

.about-intro ul li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #009688;
  font-size: 16px;
  font-weight: bold;
}

.testimonial {
  background: linear-gradient(to right, #e0f2f1, #fff4e6);
  padding: 80px 0;
}

.testimonial .section-title span {
  color: #e67c1b;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: 600;
}

.testimonial .section-title h2 {
  font-size: 32px;
  font-weight: 700;
  margin-top: 10px;
  color: #333;
}

.testimonial__item {
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.testimonial__item:hover {
  transform: translateY(-6px);
}

.testimonial__author {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.testimonial__author__pic img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
  border: 3px solid #ffe6cc;
}

.testimonial__author__text h5 {
  font-size: 18px;
  margin-bottom: 4px;
  color: #333;
}

.testimonial__author__text span {
  font-size: 14px;
  color: #777;
}

.rating {
  color: #f7c744;
  margin-bottom: 10px;
}

.testimonial__item p {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

.review-pagination button {
  background: #fff;
  border: 1px solid #ccc;
  padding: 6px 14px;
  margin: 0 5px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.review-pagination button.active,
.review-pagination button:hover {
  background: #e67c1b;
  color: #fff;
  border-color: #e67c1b;
}
</style>
