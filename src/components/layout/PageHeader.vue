<template>
  <div class=""></div>
  <!-- Offcanvas Menu End -->

  <!-- Header Section Begin -->
  <header class="header">
    <div class="header__top">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="header__top__inner">
              <div class="header__top__left"></div>
              <div class="header__logo">
                <a href="/index.html"><img src="img/logo.png" alt="" /></a>
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
                        <button class="option-link" @click="logout">Đăng xuất</button>
                        <button class="option-link"><router-link to="/history">Lịch sử</router-link></button>
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
              <li><router-link to="/blog">Blog</router-link></li>
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
.option-bar {
  position: relative;
  display: inline-block;
}

.option-btn {
  background: #e67c1b;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 22px;
  font-size: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.option-btn .caret {
  font-size: 13px;
}

.option-bar-content {
  position: absolute;
  right: 0;
  top: 110%;
  background: #fff;
  min-width: 180px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
  z-index: 100;
  border-radius: 10px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.option-link {
  color: #333;
  background: none;
  border: none;
  border-radius: 0;
  width: 100%;
  text-align: left;
  padding: 10px 19px;
  font-size: 18px;
  margin: 0;
  transition: background 0.2s;
  text-decoration: none;
}

.option-link:hover {
  background: #f5f5f5;
  color: #e67c1b;
}
</style>
