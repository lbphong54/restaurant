<template>
  <section class="hero">
    <div class="hero__slider">
      <div class="hero__item" v-for="(img, idx) in heroImages" :key="img.idx" v-show="idx === current"
        :style="{ backgroundImage: `url(${img.url})` }">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="col-lg-8">
              <div class="">
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="hero-arrow left" @click="prevBanner">&#8592;</button>
      <button class="hero-arrow right" @click="nextBanner">&#8594;</button>
    </div>
  </section>

  <div></div>
  <div class="categories">
    <div class="container">
      <div class="row"></div>
      <div class="categories__slider-wrapper">
        <button class="arrow left" @click="scrollLeft">&#8592;</button>
        <div class="categories__slider-horizontal" ref="slider">
          <div class="categories__item" v-for="cat in restaurants_types" :key="cat.id" @click="goToCategory(cat)"
            style="cursor: pointer">
            <div class="categories__item__icon">
              <img :src="cat.image" class="cat-icon" alt="category" />
            </div>
            <h5 class="categories__name">{{ cat.name }}</h5>
          </div>
        </div>
        <button class="arrow right" @click="scrollRight">&#8594;</button>
      </div>
    </div>
  </div>

  <!-- Categories Section End -->

  <!-- Product Section Begin -->
  <section class="product spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-6" v-for="item in restaurants" :key="item.id">
          <div class="product__item">
            <div class="product__item__pic"
              :style="{ backgroundImage: `url(${item.avatar || '/img/shop/product-1.jpg'})` }">
              <div class="product__label">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="product__item__text">
              <h6>
                <strong>{{ item.name }}</strong> - {{ item.address }} -
                {{ item.phone }}
              </h6>
              <div class="product__item__price">
                {{ item.price_range ? `$${item.price_range}` : "" }}
              </div>
              <div class="cart_add">
                <router-link :to="`/restaurantdetail/${item.id}`" class="add-to-cart">Đặt bàn</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Product Section End -->

  <!-- Map Begin -->
  <div class="map">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-7">
          <div class="map__inner">
            <h6>Việt Nam</h6>
            <ul>
              <li>113 Lí Thường Kiệt,Bình Thạnh, Tp. HCM</li>
              <li>info@amthucviet.com</li>
              <li>+1 800-786-1000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="map__iframe">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3919.1653793919336!2d106.68621413319248!3d10.798642614036018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1751228073277!5m2!1sen!2s"
        height="300" style="border: 0" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
    </div>
  </div>
  <!-- Map End -->
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      restaurants: [],
      loading: true,
      restaurants_types: [],
      categories: [
        { id: 1, icon: "hot-pot" },
        { id: 2, icon: "grilling" },
        { id: 3, icon: "salad" },
        { id: 4, icon: "seafood" },
        { id: 5, icon: "noodles" },
        { id: 6, icon: "goi-cuon" },
        { id: 7, icon: "sushi" },
        { id: 8, icon: "bibimbap" },
        { id: 9, icon: "food" },
        { id: 10, icon: "black-and-tan" },
      ],
      current: 0,
      timer: null,
      heroImages: [
        {
          idx: 1,
          url: "img/hero/hero-1.jpg",
          text: "Making your life sweeter one bite at a time!",
        },
        {
          idx: 2,
          url: "img/hero/hero-2.jpg",
          text: "Delicious cakes for every occasion!",
        },
        {
          idx: 3,
          url: "img/hero/hero-3.jpg",
          text: "Freshly baked happiness!",
        },
      ],
    };
  },

  mounted() {
    this.startAuto();
    axios
      .get("http://localhost:8000/api/restaurant-types")
      .then((res) => {
        console.log("Dữ liệu categories:", res.data);
        this.restaurants_types = res.data.data;
      })
      .catch((err) => {
        console.error("Lỗi khi lấy categories:", err);
      });

    axios
      .get("http://localhost:8000/api/restaurants", {
        params: {
          page: 1,
          limit: 8,
        },
      })
      .then((res) => {
        console.log("Dữ liệu trả về:", res.data);
        this.restaurants = res.data.data.data || [];
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách nhà hàng:", err);
      })
      .finally(() => {
        this.loading = false;
      });
  },

  beforeUnmount() {
    clearInterval(this.timer);
  },

  methods: {
    goToCategory(cat) {
      this.$router.push({
        name: "RestaurantPage",
        query: { restaurants_types: cat.id },
      });
    },
    startAuto() {
      this.timer = setInterval(this.nextBanner, 4000);
    },
    scrollLeft() {
      this.$refs.slider.scrollBy({ left: -150, behavior: "smooth" });
    },
    scrollRight() {
      this.$refs.slider.scrollBy({ left: 150, behavior: "smooth" });
    },
    nextBanner() {
      this.current = (this.current + 1) % this.heroImages.length;
    },
    prevBanner() {
      this.current =
        (this.current - 1 + this.heroImages.length) % this.heroImages.length;
    },
  },
};
</script>

<style>
.categories__slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.categories__slider-horizontal {
  display: flex;
  overflow-x: auto;
  gap: 24px;
  padding: 16px 0;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}

.categories__slider-horizontal::-webkit-scrollbar {
  display: none;
  /* Chrome/Safari */
}

.categories__item {
  min-width: 120px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  padding: 16px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.categories__item__icon span {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.arrow {
  position: absolute;
  z-index: 1;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  top: 50%;
  transform: translateY(-50%);
}

.arrow.left {
  left: -40px;
}

.arrow.right {
  right: -40px;
}

.hero__slider {
  position: relative;
  width: 100%;
  height: 420px;
  overflow: hidden;
}

.hero__item {
  width: 100%;
  height: 420px;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.5s;
}

.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-arrow.left {
  left: 20px;
}

.hero-arrow.right {
  right: 20px;
}

.hero__text {
  background: rgba(255, 255, 255, 0.7);
  display: inline-block;
  padding: 16px 32px;
  border-radius: 8px;
  margin-top: 120px;
}

.categories__item {
  min-width: 120px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  padding: 16px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.categories__name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0;
}
.categories__item__icon span {
  background: #e0f2f1;
  border-radius: 50%;
  padding: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

/* .cat-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 50%;
  background: #e0f2f1;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  margin-bottom: 6px;
} */

.product__label::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  border-radius: inherit;
}

.product__item:hover .product__label::after {
  transform: scaleX(1);
}


.cart_add .add-to-cart {
  display: inline-block;
  margin-top: 10px;
  background: linear-gradient(to right, #009688, #e67c1b);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.cart_add .add-to-cart:hover {
  background: linear-gradient(to right, #00796b, #cf6c14);
  transform: translateY(-1px);
  color: #fff;
}

.product__item:hover .product__label {
  background: #e67c1b; 
  transform: scale(1.05);
  transition: all 0.3s ease;
}


</style>
