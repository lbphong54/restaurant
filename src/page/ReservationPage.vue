<template>
  <div class="container">
    <h2>Đặt bàn</h2>
    <form @submit.prevent="submitBooking">
      <input type="text" v-model="full_name" placeholder="Họ và tên" required />
      <input type="text" v-model="phone" placeholder="Số điện thoại" required />
      <input type="email" v-model="email" placeholder="Email" />
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
    };
  },
  methods: {
    async submitBooking() {
      try {
        // Đảm bảo gửi cookie xác thực nếu dùng Sanctum
        axios.defaults.withCredentials = true;
        const token = localStorage.getItem('token');
        console.log("🚀 ~ submitBooking ~ token:", token)

        // Lấy restaurant_id từ query hoặc params (tùy cách bạn truyền)
        const restaurant_id = this.$route.query.restaurant_id || 1;

        const res = await axios.post('http://localhost:8000/api/reservations',
          {
            restaurant_id: restaurant_id,
            reservation_time: this.booking_time,
            adults: this.people,
            children: this.children,
            special_request: this.note,
          }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        );

        this.message = res.data.message;
        this.error = '';
      } catch (err) {
        this.error = 'Đặt bàn thất bại. Vui lòng thử lại.';
        this.message = '';
      }
    },
  },
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
