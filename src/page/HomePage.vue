<template>
  <section class="hero">
    <div class="hero__slider">
      <div class="hero__item" v-for="(img, idx) in heroImages" :key="img"
        :style="{ backgroundImage: `url(${img.url})`, display: idx === current ? 'block' : 'none', }">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="col-lg-8">
              <div class="hero__text">
                <h2>{{ img }}</h2>
                <a href="#" class="primary-btn">Our cakes</a>
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
            style="cursor:pointer">
            <div class="categories__item__icon">
              <span :class="cat.icon"></span>
              <h5>{{ cat.name }}</h5>
            </div>
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
            <h6>COlorado</h6>
            <ul>
              <li>1000 Lakepoint Dr, Frisco, CO 80443, USA</li>
              <li>Sweetcake@support.com</li>
              <li>+1 800-786-1000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="map__iframe">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10784.188505644011!2d19.053119335158936!3d47.48899529453826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1543907528304"
        height="300" style="border: 0" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
    </div>
  </div>
  <!-- Map End -->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      restaurants: [],
      loading: true,
      restaurants_types: [],
      current: 0,
      timer: null,
      heroImages: [
        {
          idx: 1,
          url: 'img/hero/hero-1.jpg',
          text: 'Making your life sweeter one bite at a time!'
        },
        {
          idx: 2,
          url: 'img/hero/hero-2.jpg',
          text: 'Delicious cakes for every occasion!'
        },
        {
          idx: 3,
          url: 'img/hero/hero-3.jpg',
          text: 'Freshly baked happiness!'
        }
      ]
    };
  },

  mounted() {
    this.startAuto();
    axios.get('http://localhost:8000/api/restaurant-types')
      .then(res => {
        console.log('Dữ liệu categories:', res.data);
        this.restaurants_types = res.data.data;
      })
      .catch(err => {
        console.error('Lỗi khi lấy categories:', err)
      });

    axios.get('http://localhost:8000/api/restaurants', {
      params: {
        page: 1,
        limit: 8,
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

  methods: {
    goToCategory(cat) {
      this.$router.push({ name: 'RestaurantPage', query: { restaurants_types: cat.name } });
    },
    startAuto() {
      this.timer = setInterval(this.next, 4000);
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
      this.current = (this.current - 1 + this.heroImages.length) % this.heroImages.length;
    },
  }
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
</style>
-->
