<template>
    <div class="login-wrapper">
        <div class="login-card">
            <h2 class="login-title">Đăng nhập</h2>

            <form @submit.prevent="handleLogin" class="login-form">
                <input type="text" placeholder="Email của bạn" v-model="email" required />
                <input type="password" placeholder="Mật khẩu" v-model="password" required />
                <button class="primary-btn" type="submit" :disabled="loading">
                    {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
                </button>
            </form>

            <div v-if="error" class="error-text">{{ error }}</div>

            <p class="signup-text">
                Bạn chưa có tài khoản?
                <router-link to="/signup">Đăng ký</router-link>
            </p>
        </div>
    </div>
</template>
  

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            error: '',
            loading: false
        };
    },
    methods: {
        async handleLogin() {
            this.error = '';
            this.loading = true;
            try {


                const res = await axios.post('http://localhost:8000/api/login', {
                    email: this.email,
                    password: this.password
                }, {
                    withCredentials: true
                });

                // Xử lý thành công (ví dụ: lưu token, chuyển trang)
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('me', JSON.stringify(res.data.data.customer));
                localStorage.setItem('userName', res.data.data.customer.full_name);
                this.$router.push('/'); // chuyển về trang chủ
            } catch (err) {
                this.error = err.response?.data?.message || 'Đăng nhập thất bại!';
            } finally {
                this.loading = false;
            }


        }
    }
};
</script>

<style scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: #f8fafa;
    padding: 32px 16px;
}

.login-card {
    width: 100%;
    max-width: 400px;
    background: #fff;
    padding: 32px 28px;
    border-radius: 12px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
    text-align: center;
}

.login-title {
    font-size: 28px;
    font-weight: 700;
    color: #e67c1b;
    margin-bottom: 24px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.login-form input {
    padding: 12px;
    font-size: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: 0.3s;
}

.login-form input:focus {
    border-color: #009688;
    outline: none;
    background-color: #fff;
}

.primary-btn {
    background: linear-gradient(to right, #009688, #e67c1b);
    color: #fff;
    padding: 12px;
    font-size: 16px;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s ease;
}

.primary-btn:hover {
    background: linear-gradient(to right, #00796b, #cf6c14);
    transform: translateY(-1px);
}

.signup-text {
    font-size: 14px;
    margin-top: 20px;
    color: #444;
}

.signup-text a {
    font-weight: 600;
    color: #009688;
    margin-left: 4px;
    text-decoration: none;
    transition: color 0.2s;
}

.signup-text a:hover {
    color: #e67c1b;
}

.error-text {
    color: red;
    font-size: 14px;
    margin-top: 12px;
}
</style>
