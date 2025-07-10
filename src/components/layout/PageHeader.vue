<template>
  <div class=""></div>
  <!-- Offcanvas Menu End -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <!-- Header Section Begin -->
  <header class="header">
    <div class="header__top">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="header__top__inner">
              <div class="header__top__left"></div>
              <div class="header__logo">
                <router-link to="/" class="header__logo-link">
                  <img src="/img/pasgo.png" alt="Logo" />
                </router-link>
              </div>
              <div class="header__top__right">
                <div class="header__top__links">
                  <div class="option-bar" ref="optionBar">
                    <button class="option-btn" @click="toggleOptionBar">
                      <i class="fa fa-user"></i>
                      <span v-if="userName">{{ userName }}</span>
                      <span v-else>Tài khoản</span>
                      <span class="caret">&#9662;</span>
                    </button>
                    <div class="option-bar-content" v-if="showOptionBar">
                      <template v-if="userName">

                        <router-link class="option-link" to="/history">Đơn đặt bàn</router-link>
                        <button class="option-link" @click="logout">Đăng xuất</button>
                      </template>
                      <template v-else>
                        <router-link to="/login" class="option-link" @click="closeOptionBar">Đăng Nhập</router-link>
                        <router-link to="/signup" class="option-link" @click="closeOptionBar">Đăng Ký</router-link>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="canvas__open"><i class="fa fa-bars"></i></div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <nav class="header__menu mobile-menu">
            <ul>
              <li><router-link to="/">Trang Chủ</router-link></li>
              <li><router-link to="/about">Về chúng tôi</router-link></li>
              <li><router-link to="/restaurant">Nhà hàng</router-link></li>
              <!-- <li><router-link to="/blog">Blog</router-link></li> -->
              <li><router-link to="/contact">Liên Hệ</router-link></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      showOptionBar: false,
      userName: localStorage.getItem('userName') || ''
    };
  },
  methods: {
    toggleOptionBar() {
      this.showOptionBar = !this.showOptionBar;
    },
    closeOptionBar() {
      this.showOptionBar = false;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      this.userName = '';
      this.closeOptionBar();
      this.$router.push('/login');
    },
    handleClickOutside(event) {
      if (this.showOptionBar && this.$refs.optionBar && !this.$refs.optionBar.contains(event.target)) {
        this.showOptionBar = false;
      }
    },
    updateUserName() {
      console.log('Updating userName...');
      this.userName = localStorage.getItem('userName') || '';
      console.log('userName from localStorage:', this.userName);
    }
  },
  mounted() {
    console.log('Component mounted');
    document.addEventListener('click', this.handleClickOutside);
    this.updateUserName();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  watch: {
    $route() {
      console.log('$route changed');
      this.updateUserName();
    }
  }
};
</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
}

.header {
  background: #ffffff;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}

.header__top {
  background: linear-gradient(to right, #009688, #e67c1b);
  color: white;
  padding: 12px 0;
  font-weight: 500;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header__logo img {
  height: 50px;
  object-fit: contain;
  padding: 10px 0;
  transition: transform 0.3s ease;
}

.header__logo img:hover {
  transform: scale(1.05);
}

.header__menu ul {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  padding: 12px 0;
  margin: 0;
  list-style: none;
}

.header__menu ul li a {
  font-size: 17px;
  color: #333;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 6px;
  transition: background 0.3s ease, color 0.3s ease;
}

.header__menu ul li a:hover {
  background: #77dcd7;
  color: #009688;
}

.option-bar {
  position: relative;
  display: inline-block;
}

.option-btn {
  background: linear-gradient(to right, #009688, #e67c1b);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 22px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}



.option-bar-content {
  position: absolute;
  right: 0;
  top: 110%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeSlide 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-link {
  padding: 12px 20px;
  font-size: 16px;
  color: #1a1a1a;
  text-decoration: none;
  background: none;
  border: none;
  text-align: left;
  transition: background 0.2s ease, color 0.2s ease;
}

.header__top__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  /* Thêm chiều cao rõ ràng nếu logo đã cao */
}


.header__logo img {
  height: 100px;
  /* 100px có thể hơi to — 70px cân bằng hơn */
  object-fit: contain;
  display: block;
  margin: 0;
  padding: 0;
}
</style>
