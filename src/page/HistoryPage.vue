<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Đơn đặt bàn</h2>

    <div v-if="loading" class="text-gray-500">Đang tải dữ liệu...</div>
    <div v-else-if="reservations.length === 0" class="text-gray-500">Bạn chưa có đơn đặt bàn nào.</div>

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
            <th class="px-4 py-2 border border-gray-300">Hủy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(res, index) in reservations" :key="res.id">
            <td class="px-4 py-2 border border-gray-300">{{ index + 1 }}</td>
            <td class="px-4 py-2 border border-gray-300">{{ res.restaurant_name || 'Không rõ' }}</td>
            <td class="px-4 py-2 border border-gray-300">
              {{ formatDate(res.reservation_time || res.datetime || res.datime) }}
            </td>
            <td class="px-4 py-2 border border-gray-300">{{ res.adults ?? '—' }}</td>
            <td class="px-4 py-2 border border-gray-300">{{ res.children ?? '—' }}</td>
            <td class="px-4 py-2 border border-gray-300">{{ res.special_request || 'Không có' }}</td>
            <td class="px-4 py-2 border border-gray-300">
              <span :class="statusClass(res.status)">
                {{ statusText(res.status) }}
              </span>
            </td>
            <td class="primary-btn">
              <button v-if="res.status === 'pending'" @click="cancelReservation(res.id)" class="cancel-btn">
                Hủy
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
import axios from 'axios';

export default {
  name: 'HistoryPage',
  data() {
    return {
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
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:8000/api/reservations/history',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        this.reservations = res.data.data || [];
      } catch (err) {
        console.error('Lỗi khi lấy danh sách đặt bàn:', err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(datetime) {
      if (!datetime) return '—';
      const date = new Date(datetime);
      return isNaN(date.getTime()) ? '—' : date.toLocaleString('vi-VN');
    },
    statusClass(status) {
      switch (status) {
        case 'confirmed':
          return 'text-green-600 font-medium';
        case 'pending':
          return 'text-yellow-600 font-medium';
        case 'cancelled':
          return 'text-red-600 font-medium';
        default:
          return 'text-gray-500';
      }
    },
    statusText(status) {
      switch (status) {
        case 'confirmed':
          return 'Xác nhận';
        case 'pending':
          return 'Đang chờ';
        case 'cancelled':
          return 'Đã hủy';
        default:
          return status;
      }
    },
    async cancelReservation(id) {
      if (!confirm('Bạn có chắc chắn muốn hủy đơn đặt bàn này?')) return;
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:8000/api/reservations/${id}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.fetchReservations();
      } catch (err) {
        alert('Hủy đặt bàn thất bại!');
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.09);
}

th,
td {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  text-align: center;
}

th {
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

tr:nth-child(even) {
  background: #fafbfc;
}

tr:hover {
  background: #f1f5f9;
}

.primary-btn {
  background: transparent;
  padding: 0;
  text-align: center;
}

.cancel-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.08);
  margin: 0 auto;
  display: block;
}

.cancel-btn:hover {
  background: #d9363e;
  color: #fff;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px rgba(255, 77, 79, 0.13);
}

.text-red-600 {
  color: #ff4d4f !important;
}

.text-green-600 {
  color: #52c41a !important;
}

.text-yellow-600 {
  color: #faad14 !important;
}

.text-gray-400 {
  color: #bdbdbd !important;
}

.text-gray-500 {
  color: #757575 !important;
}

.font-medium {
  font-weight: 500;
}
</style>