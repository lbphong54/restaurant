<template>
    <footer class="footer bg-dark text-white py-5">
        <div class="container">
            <div class="row">
                <!-- Company Info -->
                <div class="col-lg-4 col-md-6 mb-4">
                    <h5 class="text-uppercase mb-3">Thông tin doanh nghiệp</h5>
                    <p><strong>PASGO</strong></p>
                    <p>Địa chỉ: 123 Lê Lợi, Quận 1, TP.HCM</p>
                    <p>SĐT: 0909 123 456</p>
                    <p>Email: info@amthucviet.vn</p>
                    <p>MST: 0312345678</p>
                </div>

                <!-- Working Hours -->
                <div class="col-lg-4 col-md-6 mb-4">
                    <h5 class="text-uppercase mb-3">Giờ hoạt động</h5>
                    <ul class="list-unstyled">
                        <li>Thứ 2 - Thứ 6: 08:00 - 22:00</li>
                        <li>Thứ 7: 09:00 - 23:00</li>
                        <li>Chủ Nhật: 09:00 - 22:00</li>
                    </ul>
                </div>

                <!-- Social & Logo -->
                <div class="col-lg-4 col-md-12 mb-4 text-center">
                    <img src="/img/footer-pasgo.png" alt="Logo" class="mb-3" style="max-width: 150px" />
                    <p>Chúng tôi luôn nỗ lực mang lại trải nghiệm tuyệt vời nhất cho khách hàng.</p>
                    <div class="footer__social mt-3">
                        <a href="#" class="text-white me-3"><i class="fa fa-facebook fa-lg"></i></a>
                        <a href="#" class="text-white me-3"><i class="fa fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-white me-3"><i class="fa fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-white"><i class="fa fa-youtube-play fa-lg"></i></a>
                    </div>
                </div>
            </div>

            <hr class="bg-secondary" />
            <p class="text-center text-secondary mb-0">&copy; 2025 Ẩm Thực Việt. All rights reserved.</p>
        </div>
    </footer>
</template>


<script>

</script>

<style>
.footer {
    background: linear-gradient(to right, #009688, #e67c1b);
    color: #fff;
    padding: 60px 0 30px;
}

.footer h5 {
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 20px;
    font-size: 18px;
    text-transform: uppercase;
}

.footer p,
.footer li {
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    margin-bottom: 8px;
}

.footer a {
    color: #ffffff;
    transition: color 0.2s ease;
}

.footer a:hover {
    color: #e0f2f1;
}

.footer__social a {
    display: inline-block;
    margin: 0 10px;
    font-size: 20px;
    color: #fff;
    transition: transform 0.3s ease, color 0.2s;
}

.footer__social a:hover {
    color: #ffe6cc;
    transform: scale(1.2);
}

.footer hr {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    margin: 30px 0;
}

.footer p.text-secondary {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 14px;
}
</style>