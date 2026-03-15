/**
 * 毛毛家 - 个人主页
 */

const ProfilePage = {
    // 当前 Tab
    currentTab: 'pets',

    // 渲染个人主页
    render(container) {
        const user = App.currentUser;
        if (!user) {
            container.innerHTML = `
                <div class="login-prompt">
                    <div class="login-prompt-icon">👤</div>
                    <div class="login-prompt-text">登录后查看个人主页</div>
                    <button class="btn btn-primary" onclick="App.openAuthModal('login')">立即登录</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        // 用户信息头部
        this.renderHeader(container, user);

        // Tab 切换
        this.renderTabs(container);

        // Tab 内容
        this.renderTabContent(container, user);

        // 管理中心菜单
        this.renderMenu(container);
    },

    // 渲染头部
    renderHeader(container, user) {
        const header = document.createElement('div');
        header.className = 'profile-header';
        header.innerHTML = `
            <div class="profile-avatar">
                <img src="${user.avatar || defaultAvatars[0]}" alt="${user.nickname}">
            </div>
            <div class="profile-name">${user.nickname}</div>
            <div class="profile-meta">📍 ${user.city || '未设置地区'} · 加入于 ${Components.formatDate(user.createdAt)}</div>
            <div class="profile-stats">
                <div class="profile-stat">
                    <div class="profile-stat-value">${user.petCount || 0}</div>
                    <div class="profile-stat-label">发布</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-value">${user.adoptCount || 0}</div>
                    <div class="profile-stat-label">成功领养</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-value">⭐ ${user.rating ? user.rating.toFixed(1) : '5.0'}</div>
                    <div class="profile-stat-label">评分</div>
                </div>
            </div>
        `;

        container.appendChild(header);
    },

    // 渲染Tabs
    renderTabs(container) {
        const tabs = document.createElement('div');
        tabs.className = 'profile-tabs';

        const tabItems = [
            { id: 'pets', label: '发布的宠物' },
            { id: 'adoptions', label: '我的申请' },
            { id: 'favorites', label: '收藏' }
        ];

        tabs.innerHTML = tabItems.map(tab => `
            <div class="profile-tab ${this.currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
                ${tab.label}
            </div>
        `).join('');

        container.appendChild(tabs);

        // 绑定点击事件
        tabs.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.refreshTabContent(container);
            });
        });
    },

    // 渲染Tab内容
    renderTabContent(container, user) {
        const content = document.createElement('div');
        content.className = 'profile-tab-content';
        content.id = 'profileTabContent';

        container.appendChild(content);

        this.renderTabPanel(content, user);
    },

    // 渲染Tab面板
    renderTabPanel(container, user) {
        container.innerHTML = '';

        switch (this.currentTab) {
            case 'pets':
                this.renderMyPets(container, user);
                break;
            case 'adoptions':
                this.renderMyAdoptions(container, user);
                break;
            case 'favorites':
                this.renderFavorites(container, user);
                break;
        }
    },

    // 渲染我发布的宠物
    renderMyPets(container, user) {
        const pets = Store.getFilteredPets({ ownerId: user.id, status: null });

        if (pets.length === 0) {
            container.appendChild(Components.createEmptyState('🐾', '还没有发布宠物'));
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'pet-grid';

        pets.forEach(pet => {
            const card = Components.createPetCard(pet, { showStatus: true, showFav: false });
            grid.appendChild(card);
        });

        container.appendChild(grid);
    },

    // 渲染我的申请
    renderMyAdoptions(container, user) {
        const adoptions = Store.getUserAdoptions(user.id);

        if (adoptions.length === 0) {
            container.appendChild(Components.createEmptyState('📋', '还没有申请记录'));
            return;
        }

        const list = document.createElement('div');
        list.style.display = 'flex';
        list.style.flexDirection = 'column';
        list.style.gap = '12px';

        adoptions.forEach(adoption => {
            const pet = Store.getPetById(adoption.petId);
            if (!pet) return;

            const statusMap = {
                'pending': { text: '待审核', class: 'pending' },
                'accepted': { text: '已通过', class: '' },
                'rejected': { text: '已拒绝', class: 'rejected' },
                'completed': { text: '已完成', class: '' }
            };
            const status = statusMap[adoption.status] || statusMap.pending;

            const item = document.createElement('div');
            item.className = 'card';
            item.style.margin = '0';
            item.style.borderRadius = '10px';
            item.innerHTML = `
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                        <img src="${pet.media && pet.media.length > 0 ? pet.media[0] : ''}" alt="${pet.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 4px;">${pet.name}</div>
                        <div style="font-size: 12px; color: var(--ink-3);">申请于 ${Components.formatDate(adoption.createdAt)}</div>
                    </div>
                    <div style="padding: 4px 10px; background: ${status.class === 'pending' ? '#FFF3E0' : status.class === 'rejected' ? '#FFEBEE' : '#E8F5E9'}; color: ${status.class === 'pending' ? '#E65100' : status.class === 'rejected' ? '#C62828' : '#2E7D32'}; border-radius: 12px; font-size: 12px;">
                        ${status.text}
                    </div>
                </div>
            `;

            // 点击查看详情
            item.addEventListener('click', () => {
                App.navigateTo('detail', { petId: pet.id });
            });

            list.appendChild(item);
        });

        container.appendChild(list);
    },

    // 渲染收藏
    renderFavorites(container, user) {
        const favorites = Store.getFavorites(user.id);

        if (favorites.length === 0) {
            container.appendChild(Components.createEmptyState('❤️', '还没有收藏'));
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'pet-grid';

        favorites.forEach(fav => {
            const pet = Store.getPetById(fav.petId);
            if (pet) {
                const card = Components.createPetCard(pet);
                grid.appendChild(card);
            }
        });

        container.appendChild(grid);
    },

    // 刷新Tab内容
    refreshTabContent(container) {
        const content = document.getElementById('profileTabContent');
        if (content && App.currentUser) {
            this.renderTabPanel(content, App.currentUser);
        }
    },

    // 渲染菜单
    renderMenu(container) {
        const menuItems = [
            { icon: '📋', text: '我的领养申请', action: () => this.showMyAdoptions() },
            { icon: '📥', text: '收到的申请', action: () => this.showReceivedAdoptions() },
            { icon: '❤️', text: '我的收藏', action: () => { this.currentTab = 'favorites'; App.refresh(); } },
            { icon: '⭐', text: '我的评价', action: () => App.showToast('功能开发中') },
            { icon: '🔔', text: '通知设置', action: () => App.showToast('功能开发中') },
            { icon: '🔒', text: '账号安全', action: () => this.showSecurity() },
            { icon: '🚪', text: '退出登录', action: () => this.logout() }
        ];

        const menu = document.createElement('div');
        menu.className = 'menu-list';
        menu.style.marginTop = '16px';

        menu.innerHTML = menuItems.map(item => `
            <div class="menu-item">
                <span class="menu-icon">${item.icon}</span>
                <span class="menu-text">${item.text}</span>
                <span class="menu-arrow">›</span>
            </div>
        `).join('');

        container.appendChild(menu);

        // 绑定点击事件
        menu.querySelectorAll('.menu-item').forEach((item, index) => {
            item.addEventListener('click', menuItems[index].action);
        });
    },

    // 显示我的申请
    showMyAdoptions() {
        this.currentTab = 'adoptions';
        App.refresh();
    },

    // 显示收到的申请
    showReceivedAdoptions() {
        const user = App.currentUser;
        if (!user) return;

        const adoptions = Store.getReceivedAdoptions(user.id);

        if (adoptions.length === 0) {
            App.showToast('还没有收到申请');
            return;
        }

        // 创建模态框显示收到的申请
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content" style="max-height: 80vh;">
                <div class="card-header" style="margin-bottom: 16px;">
                    <span class="card-title">收到的申请</span>
                </div>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${adoptions.map(adoption => {
                        const pet = Store.getPetById(adoption.petId);
                        const applicant = Store.getUserById(adoption.applicantId);
                        if (!pet || !applicant) return '';

                        const statusMap = {
                            'pending': { text: '待审核', class: 'pending' },
                            'accepted': { text: '已通过', class: '' },
                            'rejected': { text: '已拒绝', class: 'rejected' }
                        };
                        const status = statusMap[adoption.status] || statusMap.pending;

                        return `
                            <div style="padding: 12px; background: var(--bg); border-radius: 8px; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden;">
                                        <img src="${applicant.avatar || defaultAvatars[0]}" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 500;">${applicant.nickname}</div>
                                        <div style="font-size: 12px; color: var(--ink-3);">申请领养 ${pet.name}</div>
                                    </div>
                                    <div style="font-size: 12px; color: ${status.class === 'pending' ? '#E65100' : '#2E7D32'};">${status.text}</div>
                                </div>
                                <div style="font-size: 13px; color: var(--ink-2); margin-bottom: 8px;">
                                    <div>姓名: ${adoption.realName} · 电话: ${adoption.phone}</div>
                                    <div>居住: ${adoption.livingType} · 经验: ${adoption.petExperience}</div>
                                </div>
                                ${adoption.status === 'pending' ? `
                                    <div style="display: flex; gap: 8px;">
                                        <button class="btn btn-success btn-sm" onclick="ProfilePage.handleAdoption('${adoption.id}', 'accepted')">接受</button>
                                        <button class="btn btn-outline btn-sm" onclick="ProfilePage.handleAdoption('${adoption.id}', 'rejected')">拒绝</button>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                <button class="btn-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.getElementById('app').appendChild(modal);
    },

    // 处理申请（接受/拒绝）
    handleAdoption(adoptionId, status) {
        Store.updateAdoptionStatus(adoptionId, status);

        const adoption = Store.getAdoptionById(adoptionId);
        if (adoption) {
            const pet = Store.getPetById(adoption.petId);
            const applicant = Store.getUserById(adoption.applicantId);

            // 通知申请人
            Store.addNotification(
                applicant.id,
                'adoption',
                status === 'accepted' ? '申请已通过' : '申请被拒绝',
                status === 'accepted'
                    ? `恭喜！您领养 ${pet.name} 的申请已通过，请联系发布者进行交接`
                    : `很遗憾，您领养 ${pet.name} 的申请未通过`,
                { adoptionId, petId: pet.id }
            );
        }

        App.showToast(status === 'accepted' ? '已接受申请' : '已拒绝申请');

        // 刷新
        App.refresh();
    },

    // 显示账号安全
    showSecurity() {
        const user = App.currentUser;
        if (!user) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="card-header" style="margin-bottom: 16px;">
                    <span class="card-title">账号安全</span>
                </div>
                <div style="font-size: 14px; line-height: 2;">
                    <p>手机号：${user.phone}</p>
                    <p>注册时间：${Components.formatDate(user.createdAt)}</p>
                    <p>用户角色：${user.role === 'org' ? '认证机构' : '普通用户'}</p>
                </div>
                <button class="btn-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.getElementById('app').appendChild(modal);
    },

    // 退出登录
    logout() {
        if (confirm('确定要退出登录吗？')) {
            Store.logout();
            App.currentUser = null;
            App.updateUI();
            App.navigateTo('home');
            App.showToast('已退出登录');
        }
    }
};
