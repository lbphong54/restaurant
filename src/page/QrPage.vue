<template>
    <div class="container">
        <div v-if="qrData" class="qr-code">
            <h4>Mã QR đặt cọc</h4>
            <img :src="qrValue" alt="Mã QR chuyển khoản" style="width:200px;height:200px;" />
            <p><strong>Nội dung:</strong> {{ qrData.message }}</p>
            <p><strong>Số tiền:</strong> {{ qrData.amount ? qrData.amount.toLocaleString() : '' }} VND</p>
            <p><strong>Số tài khoản:</strong> {{ qrData.bank_account_number }}</p>
            <button class="confirm-btn" @click="confirmDeposit">Xác nhận đặt cọc</button>
        </div>
        <div v-else>
            Đang tải dữ liệu...
        </div>
        <div v-if="error" style="color:red">{{ error }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            reservationId: null,
            qrData: {
                bank_code: '',
                bank_account: '',
                message: '',
                amount: 0,
            }
        };
    },
    async mounted() {
        this.reservationId = this.$route.query.reservation_id;

        // Kiểm tra token
        const token = localStorage.getItem('token');
        if (!token) {
            this.error = 'Bạn chưa đăng nhập!';
            this.message = '';
            return;
        }

        try {
            // Gọi API (dùng template string ES6)
            const res = await axios.get(
                `http://localhost:8000/api/reservations/${this.reservationId}/qr-code`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            this.qrData.bank_code = res.data.data.bank_code;
            this.qrData.bank_account = res.data.data.bank_account_number;
            this.qrData.message = `Thanh toán tiền đặt cọc - ${res.data.data.restaurant} - đơn hàng ${this.reservationId}`;
            this.qrData.amount = res.data.data.amount;

        } catch (err) {
            this.error = 'Lỗi khi lấy QR code!';
            // Có thể log err.response hoặc err.message để debug
        }
    },
    computed: {
        qrValue() {
            // Giả sử bạn dùng vietqr.io dạng ảnh, tham khảo docs vietqr.io
            if (!this.qrData) return '';
            const base = `https://api.vietqr.io/image/${this.qrData.bank_code}-${this.qrData.bank_account}-CXvgYDX.jpg`;
            const params = []
            if (this.qrData.amount) params.push(`amount=${this.qrData.amount}`)
            if (this.qrData.message) params.push(`addInfo=${encodeURIComponent(this.qrData.message)}`)
            return params.length ? `${base}?${params.join('&')}` : base
        }
    },
    methods: {
        confirmDeposit() {
            this.$router.push({ name: 'home' });
            this.$router.push({ name: 'home' });
        }
    }
};
</script>

<style>
.qr-code {
    margin-top: 24px;
    text-align: center;
    padding: 16px;
    background: #f3f3f3;
    border-radius: 8px;
}

.confirm-btn {
    margin-top: 20px;
    background: #52c41a;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 10px 28px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.confirm-btn:hover {
    background: #389e0d;
}
</style>