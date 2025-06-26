<template>
    <div class="container">
        ...
        <div v-if="qrData" class="qr-code">
            <h4>Mã QR đặt cọc</h4>
            <img :src="qrValue" alt="Mã QR chuyển khoản" style="width:200px;height:200px;" />
            <p><strong>Nội dung:</strong> {{ qrData.message }}</p>
            <p><strong>Số tiền:</strong> {{ qrData.amount.toLocaleString() }} VND</p>
            <p><strong>Số tài khoản:</strong> {{ qrData.bank_account }}</p>
        </div>
    </div>
</template>

<script>
// import QrcodeVue from 'qrcode.vue';
import axios from 'axios';

export default {
    components: {
    },
    data() {
        return {
            qrData: {
                bank_code: 970415,
                bank_account: '113366668888',
                message: 'Gửi nè',
                amount: 1000000,
            }
        };
    },
    computed: {
        qrValue() {
            if (!this.qrData) return '';
            // const base = `https://img.vietqr.io/image/${this.qrData.bank_code}-${this.qrData.bank_account}-compact2.png`
            const base = `https://api.vietqr.io/image/${this.qrData.bank_code}-${this.qrData.bank_account}-CXvgYDX.jpg`;
            // return `STK:${this.qrData.bank_account};ND:${this.qrData.message};SOTIEN:${this.qrData.amount}`;
            console.log("🚀 ~ qrValue ~ base:", base)
            const params = []
            if (this.qrData.amount) params.push(`amount=${this.qrData.amount}`)
            if (this.qrData.message) params.push(`addInfo=${encodeURIComponent(this.qrData.message)}`)
            return params.length ? `${base}?${params.join('&')}` : base
        }
    },
    methods: {
        async submitBooking() {
            try {
                const token = localStorage.getItem('token');
                const restaurant_id = this.$route.query.restaurant_id || 1;

                const res = await axios.post(
                    'http://localhost:8000/api/reservations',
                    {
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
                this.qrData = res.data.qr; // 👈 lưu dữ liệu QR
                this.error = '';
            } catch (err) {
                this.error = 'Đặt bàn thất bại. Vui lòng thử lại.';
                this.message = '';
            }
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
</style>
