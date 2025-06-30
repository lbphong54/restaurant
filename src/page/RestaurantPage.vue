<template>
  <section class="shop spad">
    <div class="container">
      <form @submit.prevent="searchRestaurants" class="mb-4">
        <div class="row gx-2 gy-2 align-items-center">
          <div class="col-md-4">
            <select v-model="selectedType" class="form-select custom-select">
              <option value="">Tất cả loại</option>
              <option
                v-for="type in restaurantTypes"
                :key="type.id"
                :value="type.name"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <select v-model="selectedAddress" class="form-select custom-select">
              <option value="">Tất cả địa chỉ</option>
              <option v-for="addr in addressList" :key="addr" :value="addr">
                {{ addr }}
              </option>
            </select>
          </div>

          <div class="col-md-4 text-md-start text-center">
            <button type="submit" class="btn btn-primary w-100">
              <i class="fa fa-search me-2"></i> Tìm nhà hàng
            </button>
          </div>
        </div>
      </form>

      <div v-if="loading" class="text-center my-5">Đang tải dữ liệu...</div>

      <div v-else class="row">
        <div
          class="col-lg-3 col-md-6 col-sm-6"
          v-for="item in restaurants"
          :key="item.id"
        >
          <div class="product__item">
            <div
              class="product__item__pic set-bg"
              :data-setbg="item.image || 'img/shop/product-1.jpg'"
            >
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
                <router-link
                  :to="`/restaurantdetail/${item.id}`"
                  class="add-to-cart"
                >
                  Đặt bàn
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div v-if="restaurants.length === 0" class="col-12 text-center mt-4">
          <em>Không tìm thấy nhà hàng phù hợp.</em>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      restaurants: [],
      loading: true,
      restaurantTypes: [],
      selectedType: "",
      searchKeyword: "",
    };
  },

  mounted() {
    const restaurants_types = this.$route.query.restaurants_types;
    // Gọi API restaurants với tham số lọc theo loại
    axios
      .get("http://localhost:8000/api/restaurants", {
        params: {
          restaurants_types, // truyền tham số lọc
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
    this.loadRestaurantTypes();
    this.searchRestaurants();
  },

  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    async loadRestaurantTypes() {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/restaurant-types"
        );
        this.restaurantTypes = res.data.data || [];
      } catch (err) {
        console.error("Không thể tải loại nhà hàng:", err);
      }
    },

    async searchRestaurants() {
      this.loading = true;
      try {
        const res = await axios.get("http://localhost:8000/api/restaurants", {
          params: {
            restaurants_types: this.selectedType,
            search: this.searchKeyword,
          },
        });
        this.restaurants = res.data.data.data || [];
      } catch (err) {
        console.error("Lỗi khi tìm nhà hàng:", err);
        this.restaurants = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.custom-select {
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 16px;
}

.btn-primary {
  background: linear-gradient(to right, #009688, #e67c1b);
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 16px;
  color: #fff;
  transition: background 0.3s ease, transform 0.2s;
}

.btn-primary:hover {
  background: linear-gradient(to right, #00796b, #cf6c14);
  transform: translateY(-1px);
}

</style>
