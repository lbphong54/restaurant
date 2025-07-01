<template>
  <div class="p-6 max-w-6xl mx-auto">
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
            <th class="px-4 py-2 border border-gray-300">Thời gian</th>
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
    };
  },
  mounted() {
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
    }
  },
  
  computed: {
    filteredReservations() {
      if (!Array.isArray(this.reservations)) return [];
      return this.reservations.filter((r) => r !== null && r !== undefined);
    },
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

</style>
