<template>
  <div class="container">
    <h2>Đặt bàn</h2>

    <div v-if="name">
      <strong>Nhà hàng:</strong> {{ name }}
    </div>

    <form @submit.prevent="submitBooking">
      <input type="text" v-model="full_name" placeholder="Họ và tên" readonly />
      <input type="text" v-model="phone" placeholder="Số điện thoại" readonly />
      <input type="email" v-model="email" placeholder="Email" readonly />
      <input type="number" v-model="people" placeholder="Số người lớn" min="1" required />
      <input type="number" v-model="children" placeholder="Số trẻ em" min="0" />
      <input type="datetime-local" v-model="booking_time" required />
      <textarea v-model="note" placeholder="Ghi chú (tùy chọn)"></textarea>
      <button type="submit">Đặt bàn</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      full_name: '',
      phone: '',
      email: '',
      people: 1,
      children: 0,
      booking_time: '',
      note: '',
      message: '',
      error: '',
      name: '',
    };
  },
  async created() {
    const restaurant_id = this.$route.query.restaurant_id || 1;

    try {
      // Lấy thông tin me
      const user = JSON.parse(localStorage.getItem('me'));
      this.full_name = user.full_name || '';
      this.phone = user.phone || '';
      this.email = user.email || '';

      // Lấy tên nhà hàng

      const resRestaurant = await axios.get(`http://localhost:8000/api/restaurants/${restaurant_id}`);
      this.name = resRestaurant.data.data.name || '';
    }
    catch (err) {
      console.error("Lỗi khi lấy thông tin:", err);
      this.error = 'Không thể lấy dữ liệu người dùng hoặc nhà hàng.';
    }
  },
  methods: {
    async submitBooking() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Bạn chưa đăng nhập!';
          this.message = '';
          return;
        }

        const restaurant_id = this.$route.query.restaurant_id || 1;
        console.log("🚀 ~ submitBooking ~ res:", this.booking_time)

        const res = await axios.post(
          'http://localhost:8000/api/reservations',
          {
            name: this.full_name,
            phone: this.phone,
            email: this.email,
            restaurant_id: restaurant_id,
            reservation_time: this.booking_time,
            adults: this.people,
            children: this.children,
            special_request: this.note
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        this.message = res.data.message;
        this.error = '';
      } catch (err) {
        console.log("🚀 ~ submitBooking ~ err:", err.response?.data || err.message);
        this.error = 'Đặt bàn thất bại. Vui lòng thử lại.';
        this.message = '';
      }
    }
  }
};
</script>


<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input,
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: #e67c1b;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #b85d0d;
}

.message {
  color: green;
  margin-top: 12px;
}

.error {
  color: red;
  margin-top: 12px;
}
</style>
