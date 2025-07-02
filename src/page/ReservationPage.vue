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
      <div class="table-map">
        <div v-for="table in tables" :key="table.id" :class="['table-item', { selected: isSelected(table) }]"
          @click="toggleTable(table)">
          {{ table.name }}
        </div>
      </div>

      <input type="datetime-local" v-model="booking_time" required />
      <textarea v-model="note" placeholder="Ghi chú (tùy chọn)"></textarea>
      <button type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting">Đang gửi...</span>
        <span v-else>Đặt bàn</span>
      </button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
// import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  // components: { Multiselect },
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
      isSubmitting: false
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
    } catch (err) {
      console.error("Lỗi khi lấy thông tin:", err);
      this.error = 'Không thể lấy dữ liệu người dùng hoặc nhà hàng.';
    }
  },
  methods: {
    async submitBooking() {
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
    },
    toggleTable(table) {
      const index = this.selectedTables.findIndex(t => t.id === table.id);
      if (index > -1) {
        this.selectedTables.splice(index, 1);
      } else {
        this.selectedTables.push(table);
      }
    },
    isSelected(table) {
      return this.selectedTables.some(t => t.id === table.id);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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
textarea,
.form-multiselect,
.multiselect__tags {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15px;
}

.form-multiselect {
  min-height: 40px;
}

.multiselect__tags {
  min-height: 40px;
}

button {
  background: linear-gradient(to right, #009688, #e67c1b);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
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

.multiselect {
  font-size: 15px;
}

.multiselect__input,
.multiselect__single {
  min-height: 36px;
  line-height: 36px;
}

.multiselect__option--highlight {
  background: #ffe5c4;
  color: #e67c1b;
}

.table-map {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  margin: 12px 0;
}

.table-item {
  background: #f0f0f0;
  border: 2px solid transparent;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
}

.table-item:hover {
  background: #ffe8cc;
}

.table-item.selected {
  background: #ffcd99;
  border-color: #e67c1b;
  font-weight: bold;
}
</style>