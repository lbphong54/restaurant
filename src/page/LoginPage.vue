<template>

    <body>
        <div class="container">
            <input type="checkbox" id="check">
            <div class="login form">
                <header>Đăng nhập</header>
                <form @submit.prevent="handleLogin">
                    <input type="text" placeholder="Nhập Email của bạn" v-model="email" required>
                    <input type="password" placeholder="Nhập mật khẩu" v-model="password" required>
                    <input type="submit" class="button" :value="loading ? 'Đang đăng nhập...' : 'Đăng nhập'"
                        :disabled="loading">
                </form>
                <div v-if="error" style="color: red; margin-top: 8px;">{{ error }}</div>
                <div class="signup">
                    <span class="signup">Bạn chưa có tài khoản?
                        <router-link to="/signup" class="">Đăng Ký</router-link>
                    </span>
                </div>
            </div>

        </div>
    </body>
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
.container {
    min-height: 480px;
    width: 100%;
    max-width: 380px;
    margin: 40px auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.13);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 32px 18px 24px 18px;
    box-sizing: border-box;
}

input[type="checkbox"] {
    display: none;
}

.form {
    width: 100%;
    position: relative;
    background: #fff;
    padding: 32px 0 0 0;
    box-sizing: border-box;
}

header {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
    color: #e67c1b;
    letter-spacing: 1px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

form input[type="text"],
form input[type="password"] {
    height: 42px;
    width: 100%;
    padding: 0 12px;
    font-size: 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;
    background: #fafafa;
    transition: border 0.2s, background 0.2s;
    box-sizing: border-box;
}

form input[type="text"]:focus,
form input[type="password"]:focus {
    border: 1.5px solid #e67c1b;
    background: #fff;
}

form input.button {
    color: #fff;
    background: #e67c1b;
    font-size: 1.08rem;
    font-weight: 600;
    margin-top: 4px;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    height: 42px;
    transition: background 0.3s;
    box-shadow: 0 2px 8px rgba(230, 124, 27, 0.08);
    width: 100%;
}

form input.button:hover {
    background: #b85d0d;
}

.signup {
    font-size: 15px;
    text-align: center;
    margin-top: 18px;
    color: #555;
    width: 100%;
}

.signup label {
    color: #e67c1b;
    cursor: pointer;
    font-weight: 600;
    margin-left: 5px;
    transition: text-decoration 0.2s, color 0.2s;
}

.signup label:hover {
    text-decoration: underline;
    color: #b85d0d;
}
</style>
