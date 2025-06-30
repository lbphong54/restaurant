<template>
  <div class="profile-grid">
  <!-- Cột trái: Thông tin cá nhân + các mục -->
  <div class="profile-left">
    <section class="info">
      <h3>Thông tin cá nhân</h3>
      <p><strong>Họ tên:</strong> {{ user.full_name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Điện thoại:</strong> {{ user.phone }}</p>
    </section>

    <section class="profile">
      <h3>Thống kê chi tiêu</h3>
      <div class="spending-box">
        <label for="month">Chọn tháng:</label>
        <select id="month" v-model="selectedMonth">
          <option v-for="m in 12" :value="m" :key="m">Tháng {{ m }}</option>
        </select>
        <p>
          <strong>Tháng {{ selectedMonth }}:</strong>
          {{ getSpending(selectedMonth).toLocaleString() }} VND –
          {{ getReservations(selectedMonth) }} lượt đặt bàn
        </p>
      </div>
    </section>

    <section class="expense-summary">
      <h3>Tổng chi tiêu tháng {{ currentMonth }}/{{ currentYear }}</h3>
      <p><strong>{{ totalThisMonth.toLocaleString() }} VND</strong></p>
      <p><strong>Lượt đặt bàn: {{ totalReservationThisMonth }} lần</strong></p>
    </section>

    <section class="expenses">
      <h3>Quản lý chi tiêu</h3>
      <form @submit.prevent="addExpense">
        <input v-model="newExpense.description" placeholder="Mô tả" required />
        <input v-model.number="newExpense.amount" type="number" placeholder="Số tiền" required />
        <input v-model="newExpense.date" type="date" required />
        <button>Thêm</button>
      </form>

      <ul>
        <li v-for="(expense, index) in expenses" :key="index">
          <span>{{ expense.date }} – {{ expense.description }}:</span>
          <strong>{{ expense.amount.toLocaleString() }} VND</strong>
          <button @click="removeExpense(index)">Xoá</button>
        </li>
      </ul>
    </section>
  </div>

  <!-- Cột phải: biểu đồ -->
  <div class="profile-right">
    <section class="chart-box">
      <h3>Biểu đồ chi tiêu theo tháng</h3>
      <canvas id="spendingChart" height="300"></canvas>
    </section>
  </div>
</div>

</template>

<script>
import axios from "axios";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default {
  data() {
    return {
      reservationData: {
        1: 2,
        2: 5,
        3: 3,
        4: 4,
        5: 6,
        6: 7, // tháng hiện tại
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      selectedMonth: new Date().getMonth() + 1, // Tháng hiện tại
      spendingData: {
        1: 1500000,
        2: 2200000,
        3: 3100000,
        4: 1800000,
        5: 2700000,
        6: 3300000, // tháng hiện tại
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      user: {
        full_name: "",
        email: "",
        phone: "",
      },
      expenses: [], // {description, amount, date}
      newExpense: {
        description: "",
        amount: 0,
        date: "",
      },
    };
  },

  mounted() {
  this.renderChart();
},

  computed: {
    currentMonth() {
      return new Date().getMonth() + 1;
    },
    currentYear() {
      return new Date().getFullYear();
    },
    totalThisMonth() {
      const month = this.currentMonth;
      const year = this.currentYear;
      return this.expenses
        .filter((e) => {
          const d = new Date(e.date);
          return d.getMonth() + 1 === month && d.getFullYear() === year;
        })
        .reduce((sum, e) => sum + e.amount, 0);
    },
    totalReservationThisMonth() {
      const month = this.currentMonth;
      return this.expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() + 1 === month;
      }).length;
    },
  },
  async created() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.user = res.data.data;

      // Tạm thời mock dữ liệu chi tiêu (có thể fetch từ API sau)
      this.expenses = [
        {
          description: "Đặt cọc nhà hàng A",
          amount: 50000,
          date: "2025-06-01",
        },
        {
          description: "Đặt bàn nhà hàng B",
          amount: 150000,
          date: "2025-06-15",
        },
      ];
    } catch (err) {
      console.error("Lỗi khi tải thông tin người dùng:", err);
    }
  },
  methods: {
    addExpense() {
      this.expenses.push({ ...this.newExpense });
      this.newExpense = { description: "", amount: 0, date: "" };
    },
    removeExpense(index) {
      this.expenses.splice(index, 1);
    },
    getSpending(month) {
      return this.spendingData[month] || 0;
    },
    getReservations(month) {
      return this.reservationData[month] || 0;
    },
    renderChart() {
    const ctx = document.getElementById('spendingChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.spendingData).map(m => `Tháng ${m}`),
        datasets: [{
          label: 'Chi tiêu (VND)',
          data: Object.values(this.spendingData),
          backgroundColor: '#009688cc',
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `${ctx.formattedValue} VND` } }
        },
        scales: {
          y: { ticks: { callback: v => v.toLocaleString() + 'đ' } }
        }
      }
    });
  },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

section {
  margin-bottom: 24px;
}

form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

input {
  padding: 6px;
  flex: 1 1 150px;
}

button {
  padding: 6px 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 6px;
}

.profile {
  max-width: 400px;
  margin: auto;
  padding: 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.spending-box {
  margin-top: 16px;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
}

select {
  margin-top: 8px;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.profile-container {
  max-width: 720px;
  margin: 40px auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  padding: 32px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

h2,
h3 {
  margin-bottom: 12px;
  color: #009688;
}

section {
  margin-bottom: 28px;
  border-bottom: 1px dashed #e0e0e0;
  padding-bottom: 20px;
}

section:last-child {
  border-bottom: none;
}

.info p {
  margin: 6px 0;
  font-size: 15px;
}

.spending-box,
.expense-summary {
  background: #f4f8f8;
  padding: 16px;
  border-radius: 10px;
  font-size: 15px;
}

select,
input[type="text"],
input[type="number"],
input[type="date"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  font-size: 15px;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

form input {
  flex: 1 1 30%;
}

form button {
  flex: 1 1 100%;
}

button {
  background: linear-gradient(to right, #009688, #e67c1b);
  border: none;
  padding: 10px 20px;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: linear-gradient(to right, #00796b, #cf6c14);
  transform: translateY(-1px);
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}

li {
  padding: 10px;
  border-radius: 6px;
  background: #f9f9f9;
  margin-bottom: 8px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li button {
  padding: 6px 10px;
  background: #ff4d4f;
  font-size: 13px;
  border-radius: 6px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin: 40px auto;
  max-width: 1200px;
  padding: 0 20px;
}

.profile-left, .profile-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-box {
  background: #f9fdfd;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

</style>
