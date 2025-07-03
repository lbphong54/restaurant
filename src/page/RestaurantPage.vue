<template>
  <section class="shop spad">
    <div class="container">
      <form @submit.prevent="searchRestaurants" class="mb-4">
        <div class="row gx-2 gy-2 align-items-center">
          <div class="col-md-4">
            <select v-model="selectedType" class="form-select custom-select">
              <option value="">Tất cả loại</option>
              <option v-for="type in restaurantTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <input v-model="searchKeyword" type="text" class="form-control"
              placeholder="Nhập địa chỉ hoặc tên nhà hàng..." />
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
                <router-link :to="`/restaurantdetail/${item.id}`" class="add-to-cart">
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
      restaurantTypes: [],
      restaurants: [],
      loading: true,
      selectedType: "",
      searchKeyword: "",
    };
  },

  mounted() {
    const type_id = this.$route.query.restaurants_types;

    const params = {};

    if (type_id) {
      params.type_id = type_id;
    }

    // Gọi API restaurants với tham số lọc theo loại
    axios
      .get("http://localhost:8000/api/restaurants", {
        params
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
  },

  methods: {
    async loadRestaurantTypes() {
      try {
        const res = await axios.get("http://localhost:8000/api/restaurant-types");
        this.restaurantTypes = res.data.data || [];
      } catch (err) {
        console.error("Lỗi khi lấy loại nhà hàng:", err);
        this.restaurantTypes = [];
      }
    },

    fetchRestaurants() {
      this.loading = true;
      const types = this.selectedType || "";
      axios.get('http://localhost:8000/api/restaurants', {
        params: { types }
      })
        .then(res => {
          this.restaurants = res.data.data.data || [];
        })
        .catch(() => {
          this.restaurants = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async searchRestaurants() {
      this.loading = true;
      const params = {};

      if (this.selectedType) {
        params.type_id = this.selectedType;
      }

      if (this.searchKeyword) {
        params.search = this.searchKeyword;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/restaurants", {
          params,
        });
        this.restaurants = res.data.data.data || [];
      } catch (err) {
        this.restaurants = [];
      } finally {
        this.loading = false;
      }
    },
  },

  watch: {
    'selectedType': 'fetchRestaurants',
    // Nếu bạn muốn auto-fetch khi route thay đổi:
    '$route.query.types': function (newType) {
      this.selectedType = newType;
      this.fetchRestaurants();
    }
  }
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
