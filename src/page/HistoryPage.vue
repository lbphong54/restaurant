<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Lịch sử đặt bàn</h2>

    <div v-if="loading" class="text-gray-500">Đang tải dữ liệu...</div>
    <div v-else-if="bookings.length === 0" class="text-gray-500">Bạn chưa có đặt bàn nào.</div>

    <div v-else class="space-y-4">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="p-4 rounded-xl shadow bg-white border relative"
      >
        <p><strong>Nhà hàng:</strong> {{ booking.restaurant_name }}</p>
        <p><strong>Thời gian:</strong> {{ formatDate(booking.datetime) }}</p>
        <p><strong>Số người:</strong> {{ booking.guests }}</p>
        <p><strong>Ghi chú:</strong> {{ booking.note || 'Không có' }}</p>
        <p>
          <strong>Trạng thái:</strong>
          <span :class="statusClass(booking.status)">{{ booking.status }}</span>
        </p>

        <!-- Đếm ngược & nút hủy -->
        <div v-if="booking.status === 'đang chờ'" class="mt-3 flex items-center justify-between">
          <div v-if="canCancel(booking)" class="text-sm text-red-600">
            Bạn có thể hủy trong: <strong>{{ countdowns[booking.id] }}</strong>
          </div>
          <button
            v-if="canCancel(booking)"
            class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            @click="cancelBooking(booking.id)"
          >
            Hủy đặt bàn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingHistory',
  data() {
    return {
      bookings: [],
      loading: true,
      countdowns: {}, // Lưu thời gian đếm ngược từng booking
      intervalId: null,
    };
  },
  mounted() {
    this.fetchBookingHistory();
    this.intervalId = setInterval(this.updateCountdowns, 1000); // Cập nhật mỗi giây
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  methods: {
    async fetchBookingHistory() {
      try {
        const res = await fetch('http://localhost:8000/api/bookings', {
          credentials: 'include',
        });
        const data = await res.json();
        this.bookings = data;
        this.initCountdowns();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(datetime) {
      return new Date(datetime).toLocaleString('vi-VN');
    },
    statusClass(status) {
      switch (status) {
        case 'đã xác nhận':
          return 'text-green-600';
        case 'đang chờ':
          return 'text-yellow-500';
        case 'đã hủy':
          return 'text-red-500';
        default:
          return 'text-gray-500';
      }
    },
    // Tính xem còn hủy được không (trong 5 phút)
    canCancel(booking) {
      const createdTime = new Date(booking.created_at);
      const now = new Date();
      const diff = (now - createdTime) / 1000; // giây
      return diff < 300; // 5 phút
    },
    initCountdowns() {
      this.bookings.forEach((booking) => {
        if (booking.status === 'đang chờ' && this.canCancel(booking)) {
          const remaining = 300 - (new Date() - new Date(booking.created_at)) / 1000;
          this.countdowns[booking.id] = this.formatSeconds(remaining);
        }
      });
    },
    updateCountdowns() {
      Object.keys(this.countdowns).forEach((id) => {
        const remaining = this.parseSeconds(this.countdowns[id]) - 1;
        if (remaining <= 0) {
          delete this.countdowns[id];
        } else {
          this.countdowns[id] = this.formatSeconds(remaining);
        }
      });
    },
    formatSeconds(seconds) {
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(Math.floor(seconds % 60)).padStart(2, '0');
      return `${m}:${s}`;
    },
    parseSeconds(timeString) {
      const [m, s] = timeString.split(':').map(Number);
      return m * 60 + s;
    },
    async cancelBooking(id) {
      if (!confirm('Bạn có chắc chắn muốn hủy đặt bàn này?')) return;

      try {
        const res = await fetch(`http://localhost:8000/api/bookings/${id}/cancel`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Hủy thất bại');
        this.fetchBookingHistory(); // Reload dữ liệu
      } catch (err) {
        alert('Hủy đặt bàn thất bại!');
        console.error(err);
      }
    },
  },
};
</script>
