<template>

    <body>
        <div class="container">
            <div class="registration form">
                <header>Đăng ký</header>
                <form @submit.prevent="handleRegister">
                    <input type="text" v-model="full_name" placeholder="Nhập tên của bạn">
                    <input type="text" v-model="phone" placeholder="Nhập số điện thoại">
                    <input type="text" v-model="email" placeholder="Nhập email">
                    <input type="password" v-model="password" placeholder="Nhập mật khẩu">
                    <input type="submit" class="button" value="Đăng ký">
                </form>
                <div v-if="error" style="color: red; margin-top: 10px;">{{ error }}</div>
                <div class="signup">
                    <span class="signup">Bạn đã có tài khoản?
                        <router-link to="/login" class="">Đăng Nhập</router-link>
                    </span>
                </div>
            </div>
        </div>
    </body>
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