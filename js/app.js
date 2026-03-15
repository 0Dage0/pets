/**
 * 毛毛家 - 应用入口与路由控制
 */

const App = {
    // 当前页面
    currentPage: 'home',

    // 当前用户
    currentUser: null,

    // 页面容器
    main: null,
    sidebar: null,
    sidebarNav: null,

    // 初始化应用
    init() {
        this.main = document.getElementById('main');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarNav = document.getElementById('sidebarNav');

        // 初始化模拟数据（仅在非API模式或无数据时）
        if (!API.isLoggedIn()) {
            MockData.initDemoData();
        }

        // 检查登录状态 - 优先使用 API
        this.currentUser = API.getCurrentUser() || Store.getCurrentUser();

        // 初始化页面
        this.initPages();

        // 初始化侧边栏导航
        this.initSidebarNav();

        // 初始化认证模态框
        this.initAuthModal();

        // 更新界面
        this.updateUI();

        // 加载首页
        this.navigateTo('home');

        // 更新未读消息数
        this.updateBadges();

        console.log('毛毛家宠物领养平台已启动');
    },

    // 初始化页面
    initPages() {
        // 创建页面容器
        const pages = ['home', 'detail', 'publish', 'adopt', 'chat', 'profile', 'explore'];

        pages.forEach(page => {
            const pageEl = document.createElement('div');
            pageEl.className = 'page';
            pageEl.id = `page-${page}`;
            this.main.appendChild(pageEl);
        });
    },

    // 初始化侧边栏导航
    initSidebarNav() {
        const navItems = this.sidebarNav.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) {
                    this.navigateTo(page);
                }
            });
        });
    },

    // 初始化认证模态框
    initAuthModal() {
        const modal = document.getElementById('authModal');
        const closeBtn = document.getElementById('closeAuthModal');
        const overlay = modal.querySelector('.modal-overlay');
        const tabs = modal.querySelectorAll('.auth-tab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        // 关闭模态框
        const closeModal = () => {
            modal.classList.remove('active');
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // 切换标签
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                if (tabName === 'login') {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                }
            });
        });

        // 登录表单提交
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await API.login(phone, password);
                if (response) {
                    this.currentUser = API.getCurrentUser();
                    this.updateUI();
                    this.updateBadges();
                    closeModal();
                    this.showToast('登录成功', 'success');
                    // 刷新当前页面
                    this.navigateTo(this.currentPage);
                }
            } catch (error) {
                // Fallback to localStorage
                const user = Store.login(phone, password);
                if (user) {
                    this.currentUser = user;
                    this.updateUI();
                    this.updateBadges();
                    closeModal();
                    this.showToast('登录成功', 'success');
                    this.navigateTo(this.currentPage);
                } else {
                    this.showToast('手机号或密码错误', 'error');
                }
            }
        });

        // 注册表单提交
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nickname = document.getElementById('registerNickname').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const city = document.getElementById('registerCity').value;

            try {
                const response = await API.register(nickname, phone, password, city);
                if (response) {
                    this.currentUser = API.getCurrentUser();
                    this.updateUI();
                    this.updateBadges();
                    closeModal();
                    this.showToast('注册成功，欢迎加入毛毛家！', 'success');
                    this.navigateTo('home');
                }
            } catch (error) {
                // Fallback to localStorage
                const result = Store.register(nickname, phone, password, city);
                if (result.error) {
                    this.showToast(result.error, 'error');
                } else {
                    this.currentUser = result;
                    this.updateUI();
                    this.updateBadges();
                    closeModal();
                    this.showToast('注册成功，欢迎加入毛毛家！', 'success');
                    this.navigateTo('home');
                }
            }
        });
    },

    // 打开登录/注册模态框
    openAuthModal(tab = 'login') {
        const modal = document.getElementById('authModal');
        const tabs = modal.querySelectorAll('.auth-tab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        tabs.forEach(t => {
            t.classList.remove('active');
            if (t.dataset.tab === tab) {
                t.classList.add('active');
            }
        });

        if (tab === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }

        modal.classList.add('active');
    },

    // 导航到指定页面
    navigateTo(page, params = {}) {
        // 检查需要登录的页面
        const loginRequired = ['publish', 'chat', 'profile'];
        if (loginRequired.includes(page) && !this.currentUser) {
            this.openAuthModal('login');
            return;
        }

        // 保存当前页面和参数
        this.currentPage = page;
        this.pageParams = params;

        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // 更新底部导航
        this.updateBottomNav(page);

        // 根据页面类型显示/隐藏搜索栏
        this.updateSearchBar(page);

        // 渲染页面内容
        this.renderPage(page, params);

        // 滚动到顶部
        window.scrollTo(0, 0);
    },

    // 更新侧边栏导航状态
    updateBottomNav(page) {
        const navItems = this.sidebarNav.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            if (item.dataset.page === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    // 更新搜索栏显示
    updateSearchBar(page) {
        // 网页版搜索栏始终显示在侧边栏中
        // 这里可以留空，因为搜索栏现在在侧边栏中
    },

    // 渲染页面
    renderPage(page, params) {
        const pageEl = document.getElementById(`page-${page}`);
        if (!pageEl) return;

        pageEl.classList.add('active');

        switch (page) {
            case 'home':
                HomePage.render(pageEl);
                break;
            case 'explore':
                HomePage.render(pageEl, { explore: true });
                break;
            case 'detail':
                DetailPage.render(pageEl, params);
                break;
            case 'publish':
                PublishPage.render(pageEl);
                break;
            case 'adopt':
                AdoptPage.render(pageEl, params);
                break;
            case 'chat':
                ChatPage.render(pageEl);
                break;
            case 'profile':
                ProfilePage.render(pageEl);
                break;
        }
    },

    // 更新用户界面
    updateUI() {
        const headerAvatar = document.getElementById('headerAvatar');
        const notificationBtn = document.getElementById('notificationBtn');

        if (this.currentUser) {
            // 显示用户头像
            headerAvatar.innerHTML = `<img src="${this.currentUser.avatar || defaultAvatars[0]}" alt="头像">`;
            headerAvatar.onclick = () => this.navigateTo('profile');

            // 显示通知按钮
            notificationBtn.style.display = 'flex';
        } else {
            // 显示默认头像，点击登录
            headerAvatar.innerHTML = `<img src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%23EAE8E4%22/><text x=%2220%22 y=%2225%22 text-anchor=%22middle%22 font-size=%2216%22>👤</text></svg>" alt="头像">`;
            headerAvatar.onclick = () => this.openAuthModal('login');

            // 隐藏通知按钮
            notificationBtn.style.display = 'none';
        }
    },

    // 更新徽章
    async updateBadges() {
        // 更新消息未读数
        if (this.currentUser) {
            let unreadCount = 0;
            let notificationCount = 0;

            // 优先使用 API
            if (API.isLoggedIn()) {
                try {
                    const conversations = await API.getConversations();
                    if (conversations) {
                        unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount?.[this.currentUser.id] || 0), 0);
                    }
                } catch (e) {
                    unreadCount = Store.getTotalUnreadCount(this.currentUser.id);
                }

                try {
                    const result = await API.getUnreadNotificationCount();
                    if (result) {
                        notificationCount = result.count || 0;
                    }
                } catch (e) {
                    notificationCount = Store.getUnreadNotificationCount(this.currentUser.id);
                }
            } else {
                unreadCount = Store.getTotalUnreadCount(this.currentUser.id);
                notificationCount = Store.getUnreadNotificationCount(this.currentUser.id);
            }

            const chatBadge = document.getElementById('chatBadge');
            if (unreadCount > 0) {
                chatBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                chatBadge.style.display = 'flex';
            } else {
                chatBadge.style.display = 'none';
            }

            const notificationBadge = document.getElementById('notificationBadge');
            if (notificationCount > 0) {
                notificationBadge.textContent = notificationCount > 99 ? '99+' : notificationCount;
                notificationBadge.style.display = 'flex';
            } else {
                notificationBadge.style.display = 'none';
            }
        }
    },

    // 显示吐司消息
    showToast(message, type = '') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast';

        if (type) {
            toast.classList.add(type);
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    // 显示加载状态
    showLoading() {
        document.getElementById('loading').classList.add('show');
    },

    // 隐藏加载状态
    hideLoading() {
        document.getElementById('loading').classList.remove('show');
    },

    // 获取页面参数
    getParams() {
        return this.pageParams || {};
    },

    // 刷新当前页面
    refresh() {
        this.navigateTo(this.currentPage, this.pageParams);
    }
};

// 搜索功能
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const keyword = e.target.value.trim();
        if (keyword) {
            HomePage.setKeyword(keyword);
            App.navigateTo('explore');
        }
    }
});

// 通知按钮点击
document.getElementById('notificationBtn')?.addEventListener('click', () => {
    // 跳转到消息页面
    App.navigateTo('chat');
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
