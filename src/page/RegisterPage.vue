<template>
    <div class="register-wrapper">
        <div class="register-card">
            <h2 class="form-title">Đăng ký tài khoản</h2>

            <form @submit.prevent="handleRegister" class="register-form">
                <input type="text" v-model="full_name" placeholder="Họ và tên" required />
                <input type="text" v-model="phone" placeholder="Số điện thoại" required />
                <input type="email" v-model="email" placeholder="Email" required />
                <input type="password" v-model="password" placeholder="Mật khẩu" required />

                <button type="submit" class="primary-btn">Đăng ký</button>
            </form>

            <div v-if="error" class="error-text">{{ error }}</div>

            <p class="auth-link">
                Đã có tài khoản?
                <router-link to="/login">Đăng nhập</router-link>
            </p>
        </div>
    </div>
</template>
  

<script>
import axios from 'axios';

export default {
    name: 'RegisterPage',
    data() {
        return {
            name: '',
            phone: '',
            email: '',
            password: '',
            error: '',
        };
    },
    methods: {
        async handleRegister() {
            try {
                await axios.post('http://localhost:8000/api/register', {
                    full_name: this.full_name,
                    phone: this.phone,
                    email: this.email,
                    password: this.password
                });
                alert('Đăng ký thành công!');
                this.$router.push('/login');
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.error = Object.values(error.response.data.errors).flat().join(', ');
                } else {
                    this.error = 'Đăng ký thất bại.';
                }
            }
        }
    }
}
</script>

<style scoped>
.register-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: #f8fafa;
    padding: 32px 16px;
}

.register-card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    padding: 32px 28px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    text-align: center;
}

.form-title {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 24px;
    color: #e67c1b;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.register-form input {
    padding: 12px;
    font-size: 15px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #fafafa;
    transition: 0.3s;
}

.register-form input:focus {
    border-color: #009688;
    background: #fff;
    outline: none;
}

.primary-btn {
    background: linear-gradient(to right, #009688, #e67c1b);
    color: #fff;
    border: none;
    padding: 12px;
    font-weight: bold;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s;
}

.primary-btn:hover {
    background: linear-gradient(to right, #00796b, #cf6c14);
    transform: translateY(-1px);
}

.error-text {
    color: red;
    font-size: 14px;
    margin-top: 12px;
}

.auth-link {
    font-size: 14px;
    margin-top: 20px;
    color: #444;
}

.auth-link a {
    font-weight: 600;
    margin-left: 4px;
    color: #009688;
    text-decoration: none;
}

.auth-link a:hover {
    color: #e67c1b;
}
</style>