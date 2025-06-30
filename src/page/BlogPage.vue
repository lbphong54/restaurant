<template>
    <section class="blog spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <div class="blog__item" v-for="blog in paginatedBlogs" :key="blog.id">
                        <div class="blog__item__pic set-bg" :style="{ backgroundImage: `url(${blog.image})` }">
                            <div class="blog__pic__inner">
                                <div class="label">{{ blog.category }}</div>
                                <ul>
                                    <li>
                                        By <span>{{ blog.author }}</span>
                                    </li>
                                    <li>{{ blog.date }}</li>
                                    <li>{{ blog.views }} lượt xem</li>
                                </ul>
                            </div>
                        </div>
                        <div class="blog__item__text">
                            <h2>{{ blog.title }}</h2>
                            <p>{{ blog.description }}</p>
                            <a href="#" @click.prevent="openModal(blog)">XEM CHI TIẾT</a>

                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="shop__pagination">
                        <a href="#" v-for="page in totalPages" :key="page" @click.prevent="changePage(page)"
                            :class="{ active: currentPage === page }">{{ page }}</a>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="blog__sidebar">
                        <!-- Tìm kiếm -->
                        <div class="blog__sidebar__search">
                            <form action="#">
                                <input type="text" placeholder="Tìm kiếm bài viết..." />
                                <button type="submit"><i class="fa fa-search"></i></button>
                            </form>
                        </div>

                        <!-- Bài viết nổi bật -->
                        <div class="blog__sidebar__item">
                            <h5>Bài viết nổi bật</h5>
                            <div class="blog__sidebar__recent">
                                <a v-for="post in popularPosts" :key="post.id" href="#"
                                    class="blog__sidebar__recent__item">
                                    <div class="blog__sidebar__recent__item__pic">
                                        <img :src="post.image" alt="" />
                                    </div>
                                    <div class="blog__sidebar__recent__item__text">
                                        <h4>{{ post.title }}</h4>
                                        <span>{{ post.date }}</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <button class="modal-close" @click="closeModal">×</button>
            <h2>{{ selectedBlog.title }}</h2>
            <p><em>{{ selectedBlog.date }} • {{ selectedBlog.views }} lượt xem</em></p>
            <img :src="selectedBlog.image" alt="" style="width:100%; border-radius:8px;" />
            <p class="mt-3">{{ selectedBlog.description }}</p>
        </div>
    </div>

</template>

<script>
export default {
  data() {
    return {
        selectedBlog: null,
        showModal: false,
        popularPosts: [
            {
                id: 1,
                title: "Bí quyết luộc rau xanh giòn",
                image: "img/blog/br-1.jpg",
                date: "25 Tháng 6, 2025",
            },
            {
                id: 2,
                title: "Nướng thịt không khô – Mẹo đơn giản",
                image: "img/blog/br-2.jpg",
                date: "20 Tháng 6, 2025",
            },
            {
                id: 3,
                title: "Cách nấu phở bò đậm vị truyền thống",
                image: "img/blog/br-3.jpg",
                date: "15 Tháng 6, 2025",
            },
            {
                id: 4,
                title: "Salad trái cây – lựa chọn lành mạnh mùa hè",
                image: "img/blog/br-4.jpg",
                date: "10 Tháng 6, 2025",
            },
            {
                id: 5,
                title: "Cháo ếch Singapore chuẩn vị tại nhà",
                image: "img/blog/br-5.jpg",
                date: "5 Tháng 6, 2025",
            },
        ],
      allBlogs: [
        {
          id: 1,
          title: "Cách làm gỏi cuốn tôm thịt ngon chuẩn vị",
          author: "Nguyễn Thị Lan",
          date: "28 Tháng 6 2025",
          views: 856,
          category: "Món Việt",
          image: "img/blog/goi-cuon.jpg",
          description: "Gỏi cuốn là món ăn thanh mát, dễ làm...",
        },
        {
          id: 2,
          title: "5 mẹo nướng thịt mềm, không bị khô",
          author: "Trần Minh",
          date: "25 Tháng 6 2025",
          views: 532,
          category: "Bí quyết",
          image: "img/blog/nuong.jpg",
          description: "Muốn món nướng thơm ngon đúng điệu...",
        },
        {
          id: 3,
          title: "Khám phá các loại lẩu nổi tiếng ở Việt Nam",
          author: "Phạm Huyền",
          date: "20 Tháng 6 2025",
          views: 748,
          category: "Ẩm thực",
          image: "img/blog/lau.jpg",
          description: "Lẩu là món ăn gắn liền với những buổi sum họp...",
        },
        {
          id: 4,
          title: "Bún bò Huế – linh hồn ẩm thực miền Trung",
          author: "Lê Văn Hoàng",
          date: "15 Tháng 6 2025",
          views: 1002,
          category: "Đặc sản",
          image: "img/blog/bun-bo.jpg",
          description: "Bún bò Huế là sự hòa quyện giữa vị cay...",
        },
        // Thêm nhiều bài khác nếu muốn
      ],
      blogsPerPage: 2,
      currentPage: 1,
    };
  },

  computed: {
    paginatedBlogs() {
      const start = (this.currentPage - 1) * this.blogsPerPage;
      return this.allBlogs.slice(start, start + this.blogsPerPage);
    },
    totalPages() {
      return Math.ceil(this.allBlogs.length / this.blogsPerPage);
    },
  },

  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: "smooth" }); // cuộn lên đầu
      }
    },
      openModal(blog) {
          this.selectedBlog = blog;
          this.showModal = true;
          document.body.style.overflow = 'hidden'; // Ngăn cuộn nền
      },
      closeModal() {
          this.showModal = false;
          this.selectedBlog = null;
          document.body.style.overflow = '';
      }
  },
};
</script>

<style>
.blog__item {
    margin-bottom: 40px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    background: #fff;
    transition: transform 0.3s ease;
}

.blog__item:hover {
    transform: translateY(-4px);
}

.blog__item__pic {
    height: 250px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.blog__pic__inner {
    position: absolute;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
}

.blog__pic__inner .label {
    display: inline-block;
    background: #e67c1b;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    margin-bottom: 6px;
}

.blog__pic__inner ul {
    display: flex;
    gap: 16px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    font-size: 13px;
}

.blog__item__text {
    padding: 20px 24px;
}

.blog__item__text h2 {
    font-size: 20px;
    color: #333;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1.4;
}

.blog__item__text p {
    color: #666;
    font-size: 15px;
    margin-bottom: 12px;
}

.blog__item__text a {
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 600;
    color: #009688;
    text-decoration: none;
    transition: color 0.2s;
}

.blog__item__text a:hover {
    color: #e67c1b;
}

/* Pagination */
.shop__pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.shop__pagination a {

    background: linear-gradient(to right, #00796b, #cf6c14);
    color: #333;
    font-weight: 500;
    border-radius: 6px;
    text-decoration: none;
    transition: background 0.3s, color 0.3s;
}

.shop__pagination a.active,
.shop__pagination a:hover {
    background: #e67c1b;
    color: #fff;
}

/* Sidebar */
.blog__sidebar {
    padding-left: 16px;
}

.blog__sidebar__search input {
    width: calc(100% - 44px);
    padding: 10px;
    border-radius: 6px 0 0 6px;
    border: 1px solid #ccc;
    outline: none;
}

.blog__sidebar__search button {
    padding: 10px 14px;
    border-radius: 0 6px 6px 0;
    border: 1px solid #ccc;
    background: #e67c1b;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s;
}

.blog__sidebar__search button:hover {
    background: #cf6c14;
}

.blog__sidebar__recent__item {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
    align-items: center;
}

.blog__sidebar__recent__item__pic img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
}

.blog__sidebar__recent__item__text h4 {
    font-size: 15px;
    color: #333;
    margin: 0 0 4px;
    line-height: 1.4;
}

.blog__sidebar__item__categories ul {
    list-style: none;
    padding: 0;
    font-size: 14px;
}

.blog__sidebar__item__categories li {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    max-width: 700px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    animation: fadeIn 0.3s ease;
}

.modal-close {
    position: absolute;
    top: 12px;
    right: 14px;
    background: transparent;
    font-size: 26px;
    border: none;
    cursor: pointer;
    color: #999;
}

.modal-close:hover {
    color: #e67c1b;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
