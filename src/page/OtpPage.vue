<template>
    <div class="otp-container">
        <h2>Xác thực OTP</h2>
        <p>Nhập mã OTP đã được gửi tới email của bạn.</p>

        <div class="otp-inputs">
            <input v-for="(digit, index) in otp" :key="index" type="text" maxlength="1" class="otp-box"
                v-model="otp[index]" @input="onInput(index, $event)" @keydown.backspace="onBackspace(index, $event)"
                ref="otpRefs" />
        </div>

        <button class="submit-btn" @click="submitOtp">Xác nhận</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            otp: ["", "", "", "", "", ""],
            error: "",
            success: ""
        };
    },
    methods: {
        async submitOtp() {
            const code = this.otp.join("");
            if (code.length < 6) {
                this.error = "Vui lòng nhập đầy đủ mã OTP.";
                this.success = "";
                return;
            }

            try {
                const email = this.$route.query.email;
                const res = await axios.post('http://localhost:8000/api/verify-otp', {
                    email: email,
                    otp: code
                });
                this.success = "Xác thực thành công!";
                this.error = "";
                console.log('Xác thực:', res.data);
                // Chuyển về trang login hoặc trang chủ sau khi xác thực thành công
                setTimeout(() => {
                    this.$router.push('/login');
                }, 1500);
            } catch (err) {
                this.error = err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.";
                this.success = "";
            }
        },

        onInput(index, e) {
            const value = e.target.value;
            if (/^\d$/.test(value)) {
                this.otp[index] = value;
                if (index < this.otp.length - 1) {
                    this.$refs.otpRefs[index + 1].focus();
                }
            } else {
                this.otp[index] = "";
            }
        },
        onBackspace(index) {
            if (!this.otp[index] && index > 0) {
                this.$refs.otpRefs[index - 1].focus();
            }
        },
    }
};
</script>

<style scoped>
.otp-container {
    max-width: 400px;
    margin: 60px auto;
    padding: 24px;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    background-color: #fff;
    text-align: center;
}

.otp-inputs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
}

.otp-box {
    width: 45px;
    height: 45px;
    font-size: 20px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.submit-btn {
    padding: 10px 20px;
    background: linear-gradient(to right, #009688, #e67c1b);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.submit-btn:hover {
    background-color: #cc6c10;
}

.error {
    color: red;
    margin-top: 12px;
}

.success {
    color: green;
    margin-top: 12px;
}
</style>
