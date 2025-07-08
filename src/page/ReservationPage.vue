<template>
  <div class="container">
    <h2>Đặt bàn</h2>

    <div v-if="name">
      <strong>Nhà hàng:</strong> {{ name }}
    </div>

    <form @submit.prevent="submitBooking">
      <label>
        Họ và tên:
        <input type="text" v-model="full_name" readonly />
      </label>

      <label>
        Số điện thoại:
        <input type="text" v-model="phone" readonly />
      </label>

      <label>
        Email:
        <input type="email" v-model="email" readonly />
      </label>

      <label>
        Số người lớn:
        <input type="number" v-model="people" readonly />
      </label>

      <label>
        Số trẻ em:
        <input type="number" v-model="children" readonly />
      </label>

      <div>
        <strong>Bàn đã chọn:</strong>
        <div class="table-map">
          <div v-for="table in selectedTables" :key="table.id" class="table-item">
            {{ table.name }}
          </div>
        </div>
      </div>

      <label>
        Ngày giờ đặt bàn:
        <input type="datetime-local" v-model="booking_time" readonly disabled />
      </label>

      <label>
        Ghi chú (tuỳ chọn):
        <textarea v-model="note" placeholder="Ghi chú (tùy chọn)"></textarea>
      </label>

      <button type="submit" :disabled="isSubmitting || timer <= 0">
        <span v-if="isSubmitting">Đang gửi...</span>
        <span v-else-if="timer > 0">Đặt bàn ({{ timer }}s)</span>
        <span v-else>Hết thời gian đặt bàn</span>
      </button>
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
      tables: [],
      selectedTables: [],
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
      isSubmitting: false,
      timer: 0,
      timerInterval: null,
      sessionCode: this.$route.query.session_code || null,
      restaurant_id: this.$route.query.restaurant_id || null,
    };
  },
  async created() {
    const restaurant_id = this.$route.query.restaurant_id || 1;
    try {
      const user = JSON.parse(localStorage.getItem('me'));
      this.full_name = user?.full_name || '';
      this.phone = user?.phone || '';
      this.email = user?.email || '';

      const [resRestaurant, resTable] = await Promise.all([
        axios.get(`http://localhost:8000/api/restaurants/${restaurant_id}`),
        axios.get(`http://localhost:8000/api/restaurants-table`, {
          params: { id: restaurant_id }
        })
      ]);

      this.tables = resTable.data ?? [];
      this.name = resRestaurant.data.data.name || '';

      this.restoreFromURL();
      this.startTimer();
      this.checkSession();
    } catch (err) {
      console.error("Lỗi khi lấy thông tin:", err);
      this.error = 'Không thể lấy dữ liệu người dùng hoặc nhà hàng.';
    }
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
  methods: {
    checkSession() {
      if (this.sessionCode) {
        const expiredTime = localStorage.getItem(`booking_session_${this.sessionCode}`);

        if (expiredTime && new Date(expiredTime) < new Date()) {

          localStorage.removeItem(`booking_session_${this.sessionCode}`);

          alert('Phiên đặt bàn đã hết hạn! Bạn sẽ được chuyển về trang nhà hàng.');

          this.$router.push(`/restaurantdetail/${this.restaurant_id}`);
        } else {
          const now = new Date();
          const expireDate = new Date(expiredTime);
          const diffMs = expireDate - now;
          this.timer = Math.floor(diffMs / 1000);
        }
      }
    },
    restoreFromURL() {
      const query = this.$route.query;
      if (query.adults) {
        this.people = parseInt(query.adults);
      }
      if (query.children) {
        this.children = parseInt(query.children);
      }
      if (query.time) {
        this.booking_time = query.time;
      }
      if (query.tables) {
        const tableIds = query.tables.split(',').map(id => parseInt(id));
        this.selectedTables = this.tables.filter(t => tableIds.includes(t.id));
      }
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
    async submitBooking() {
      if (this.timer <= 0) {
        this.error = 'Bạn đã hết thời gian để đặt bàn!';
        return;
      }

      try {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Bạn chưa đăng nhập!';
          this.message = '';
          return;
        }

        const restaurant_id = this.$route.query.restaurant_id || 1;
        const selectedTableIds = this.selectedTables.map(table => table.id);

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
            special_request: this.note,
            table_ids: selectedTableIds
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        this.message = res.data.message || 'Đặt bàn thành công!';
        this.error = '';
        if (res.data.data && res.data.data.id) {
          this.$router.push({ name: 'qrpay', query: { reservation_id: res.data.data.id } });
        } else {
          this.$router.push({ name: 'qrpay' });
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Đặt bàn thất bại. Vui lòng thử lại.';
        this.message = '';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 24px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-weight: 600;
  font-size: 15px;
  color: #555;
}

label input {
  flex: 1;
}

input,
textarea {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  background: #f9f9f9;
  transition: border 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #009688;
  outline: none;
  background: #fff;
}

button {
  background: linear-gradient(to right, #009688, #e67c1b);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #e67c1b;
  transform: translateY(-2px);
}

.table-map {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 14px;
  margin-top: 10px;
}

.table-item {
  background: #ececec;
  border: 2px dashed #aaa;
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
  opacity: 0.8;
  cursor: not-allowed;
}

.message {
  color: #2e7d32;
  text-align: center;
  margin-top: 15px;
  font-weight: 600;
}

.error {
  color: #d32f2f;
  text-align: center;
  margin-top: 15px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .container {
    padding: 20px;
  }

  button {
    font-size: 15px;
  }
}
</style>
