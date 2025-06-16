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
                <a href="./index.html"><img src="img/logo.png" alt="" /></a>
              </div>
              <div class="header__top__right">
                <div class="header__top__right__links">
                  <ul id="menu" class="login-menu">
                    <li>
                      <router-link to="/login" class="login-btn"
                        >Đăng Nhập</router-link
                      >
                    </li>
                    <li>
                      <router-link to="/register" class="login-btn"
                        >Đăng Ký</router-link
                      >
                    </li>
                  </ul>
                </div>
                <div class="header__top__right__cart"></div>
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
              <li><router-link to="./">Trang Chủ</router-link></li>
              <li><router-link to="./about">Về chúng tôi</router-link></li>
              <li><router-link to="./restaurant">Nhà hàng</router-link></li>

              <li><router-link to="./blog">Blog</router-link></li>
              <li><router-link to="./contact">Liên Hệ</router-link></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script></script>

<style>
.login-menu {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.login-btn {
  background: #f3410b;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 18px;
  font-size: 15px;
  cursor: pointer;
  margin-left: 0;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
}
.login-btn:hover {
  background: #e3420c;
}
</style>
