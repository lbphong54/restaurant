<template>
  <div class="p-6 max-w-6xl mx-auto">

    <div class="profile-left">
      <section class="info">
        <h3>Thông tin cá nhân</h3>
        <p><strong>Họ tên:</strong> {{ user.full_name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Điện thoại:</strong> {{ user.phone }}</p>
      </section>

      <section class="profile">
        <h3 class="text-xl font-semibold mb-4">📊 Thống kê chi tiêu tháng hiện tại</h3>
        <div class="spending-box">
          <p><strong>Tháng {{ selectedMonth }}:</strong></p>
          <div style="display: flex; gap: 12px;">
            <div class="stat stat-total">
              <p>Tổng lượt đặt bàn</p>
              <p class="number">{{ this.summary.total }}</p>
            </div>
            <div class="stat stat-success">
              <p>Đặt bàn thành công</p>
              <p class="number">{{ this.summary.success }}</p>
            </div>
            <div class="stat stat-failed">
              <p>Đặt bàn thất bại</p>
              <p class="number">{{ this.summary.failed }}</p>
            </div>
            <div class="stat stat-wait">
              <p>Đặt bàn đang chờ xác nhận</p>
              <p class="number">{{ this.summary.waiting }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <h2 class="text-2xl font-bold mb-4">Đơn đặt bàn</h2>

    <div v-if="loading" class="text-gray-500">Đang tải dữ liệu...</div>
    <div v-else-if="reservations.length === 0" class="text-gray-500">
      Bạn chưa có đơn đặt bàn nào.
    </div>

    <div v-else class="overflow-auto rounded-xl border border-gray-300 bg-white">
      <table class="min-w-full text-sm text-left border-collapse">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-2 border border-gray-300">STT</th>
            <th class="px-4 py-2 border border-gray-300">Nhà hàng</th>
            <th class="px-4 py-2 border border-gray-300">Thời gian đặt</th>
            <th class="px-4 py-2 border border-gray-300">Thời gian tạo</th>
            <th class="px-4 py-2 border border-gray-300">Người lớn</th>
            <th class="px-4 py-2 border border-gray-300">Trẻ em</th>
            <th class="px-4 py-2 border border-gray-300">Ghi chú</th>
            <th class="px-4 py-2 border border-gray-300">Trạng thái</th>
            <th class="px-4 py-2 border border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(res, index) in filteredReservations" :key="res.id">
            <td class="px-4 py-2 border border-gray-300">{{ index + 1 }}</td>
            <td class="px-4 py-2 border border-gray-300">
              {{ res.restaurant?.name || "Không rõ" }}
            </td>
            <td class="px-4 py-2 border border-gray-300">
              {{
                formatDate(res.reservation_time || res.datetime || res.datime)
              }}
            </td>
            <td class="px-4 py-2 border border-gray-300">
              {{ formatDate(res.created_at) }}
            </td>
            <td class="px-4 py-2 border border-gray-300">
              {{ res.num_adults ?? "—" }}
            </td>
            <td class="px-4 py-2 border border-gray-300">
              {{ res.num_children ?? "—" }}
            </td>
            <td class="px-4 py-2 border border-gray-300">
              {{ res.special_request || "Không có" }}
            </td>
            <td class="px-4 py-2 border border-gray-300">
              <span :class="statusClass(res.status)">
                {{ statusText(res.status) }}
              </span>
            </td>
            <td>
              <button v-if="canCancel(res)" @click="cancelReservation(res.id)" class="cancel-btn"
                :disabled="cancelingId === res.id">
                <i class="fas fa-times-circle mr-1"></i>
                <span v-if="cancelingId !== res.id">Hủy</span>
                <span v-else>Đang hủy...</span>
              </button>
              <span v-else class="text-gray-400 text-sm">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HistoryPage",
  data() {
    return {
      cancelingId: null,
      reservations: [],
      loading: true,
      reservationData: {
        1: 2,
        2: 5,
        3: 3,
        4: 4,
        5: 6,
        6: 7,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      selectedMonth: new Date().getMonth() + 1,
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
      summary: {},
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/login");
      return;
    }

    const user = localStorage.getItem("me");
    this.user = user ? JSON.parse(user) : {};
    this.fetchReservations();
  },
  methods: {
    async fetchReservations() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/reservations/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.reservations = res.data.data.data ?? [];
        this.summary = res.data.summary || {};
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đặt bàn:", err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(datetime) {
      if (!datetime) return "—";
      const date = new Date(datetime);
      return isNaN(date.getTime()) ? "—" : date.toLocaleString("vi-VN");
    },
    statusClass(status) {
      switch (status) {
        case "confirmed":
          return "text-green-600 font-medium";
        case "pending":
          return "text-yellow-600 font-medium";
        case "cancelled":
          return "text-red-600 font-medium";
        default:
          return "text-gray-500";
      }
    },
    statusText(status) {
      switch (status) {
        case "confirmed":
          return "Xác nhận";
        case "pending":
          return "Đang chờ";
        case "cancelled":
          return "Đã hủy";
        case "completed":
          return "Hoàn thành";
        default:
          return status;
      }
    },
    canCancel(res) {
      return (res.status == 'pending' || res.status == 'confirmed');
    },
    async cancelReservation(id) {
      if (!confirm("Bạn có chắc chắn muốn hủy đơn đặt bàn này?")) return;
      this.cancelingId = id;
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `http://localhost:8000/api/reservations/${id}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.fetchReservations();
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Hủy đặt bàn thất bại, vui lòng thử lại sau.";
        alert(msg);
        console.error(err);
      } finally {
        this.cancelingId = null;
      }
    },
    getSpending(month) {
      return this.spendingData[month] || 0;
    },
    getReservations(month) {
      return this.reservationData[month] || 0;
    },
  },

  computed: {
    filteredReservations() {
      if (!Array.isArray(this.reservations)) return [];
      return this.reservations.filter((r) => r !== null && r !== undefined);
    },
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
    }
  },
};
</script>

<style scoped>
.cancel-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn:hover:not(:disabled) {
  background: #d9363e;
  transform: translateY(-2px);
}

table tr:hover {
  background-color: #f9fafb;
  transition: background 0.3s ease;
}

th {
  font-weight: 600;
}

td,
th {
  border: 1px solid #e5e7eb;
  /* mềm mại hơn #ccc */
  padding: 12px 16px;
}

.profile-left {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info,
.profile {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.info h3,
.profile h3 {
  font-size: 18px;
  margin-bottom: 0.75rem;
}

.spending-box {
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  background: #fff;
}

.spending-box .stat {
  flex: 1;
  text-align: center;
  border-radius: 8px;
  padding: 12px;
}

.spending-box .stat-total {
  background: #d1fae5;
  color: #065f46;
}

.spending-box .stat-success {
  background: #bfdbfe;
  color: #1e3a8a;
}

.spending-box .stat-failed {
  background: #fecaca;
  color: #b91c1c;
}

.spending-box .stat-wait {
  background: #d2e274;
  color: #ccc233;
}

.spending-box .number {
  font-size: 24px;
  font-weight: bold;
}
</style>
