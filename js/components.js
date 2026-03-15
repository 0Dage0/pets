/**
 * 毛毛家 - UI 组件库
 */

const Components = {
    // 创建宠物卡片
    createPetCard(pet, options = {}) {
        const { showStatus = true, showFav = true } = options;
        const typeInfo = MockData.getPetTypeInfo(pet.type);
        const genderEmoji = pet.gender === 'male' ? '♂️' : pet.gender === 'female' ? '♀️' : '';

        const card = document.createElement('div');
        card.className = 'pet-card';
        card.dataset.petId = pet.id;

        // 状态标签
        let statusBadge = '';
        if (showStatus && pet.status) {
            const statusMap = {
                'available': { text: '待领养', class: '' },
                'applying': { text: '申请中', class: '' },
                'handover': { text: '交接中', class: '' },
                'adopted': { text: '已领养', class: 'adopted' }
            };
            const status = statusMap[pet.status];
            if (status) {
                statusBadge = `<span class="pet-card-badge ${status.class}">${status.text}</span>`;
            }
        }

        // 收藏按钮
        let favBtn = '';
        if (showFav && App.currentUser) {
            const isFav = Store.isFavorited(App.currentUser.id, pet.id);
            favBtn = `<div class="pet-card-fav ${isFav ? 'active' : ''}" data-pet-id="${pet.id}">${isFav ? '❤️' : '🤍'}</div>`;
        }

        // 媒体图片
        const mediaUrl = pet.media && pet.media.length > 0
            ? pet.media[0]
            : `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%23EAE8E4%22 width=%22200%22 height=%22200%22/><text x=%22100%22 y=%22110%22 text-anchor=%22middle%22 font-size=%2240%22>${typeInfo.icon}</text></svg>`;

        card.innerHTML = `
            <div class="pet-card-img-wrap">
                <img class="pet-card-img" src="${mediaUrl}" alt="${pet.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%23EAE8E4%22 width=%22200%22 height=%22200%22/><text x=%22100%22 y=%22110%22 text-anchor=%22middle%22 font-size=%2240%22>${typeInfo.icon}</text></svg>'">
                ${statusBadge}
                ${favBtn}
            </div>
            <div class="pet-card-info">
                <div class="pet-card-name">
                    ${pet.name}
                    ${pet.gender !== 'unknown' ? `<span class="pet-card-gender">${genderEmoji}</span>` : ''}
                </div>
                <div class="pet-card-tags">
                    ${pet.breed ? `<span class="pet-card-tag">${pet.breed}</span>` : ''}
                    <span class="pet-card-tag">${pet.age}</span>
                </div>
                <div class="pet-card-location">
                    📍 ${pet.city}
                </div>
            </div>
        `;

        // 点击卡片跳转详情
        card.addEventListener('click', (e) => {
            if (e.target.closest('.pet-card-fav')) {
                // 收藏按钮点击不跳转
                return;
            }
            App.navigateTo('detail', { petId: pet.id });
        });

        // 收藏按钮点击事件
        const favBtnEl = card.querySelector('.pet-card-fav');
        if (favBtnEl) {
            favBtnEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleFavorite(favBtnEl, pet.id);
            });
        }

        return card;
    },

    // 处理收藏
    handleFavorite(btn, petId) {
        if (!App.currentUser) {
            App.openAuthModal('login');
            return;
        }

        const isFav = Store.toggleFavorite(App.currentUser.id, petId);
        btn.innerHTML = isFav ? '❤️' : '🤍';
        btn.classList.toggle('active', isFav);

        App.showToast(isFav ? '已收藏' : '已取消收藏');
    },

    // 创建宠物卡片消息
    createPetCardMessage(pet) {
        const typeInfo = MockData.getPetTypeInfo(pet.type);

        return `
            <div class="message-pet-card" data-pet-id="${pet.id}">
                <img class="message-pet-card-img" src="${pet.media && pet.media.length > 0 ? pet.media[0] : ''}" alt="${pet.name}" onerror="this.parentElement.style.display='none'">
                <div class="message-pet-card-info">
                    <div class="message-pet-card-name">${pet.name} · ${pet.breed || typeInfo.label}</div>
                    <div class="message-pet-card-desc">${pet.age} · ${pet.city}</div>
                </div>
            </div>
        `;
    },

    // 创建空状态
    createEmptyState(icon, text) {
        const div = document.createElement('div');
        div.className = 'empty-state';
        div.innerHTML = `
            <div class="empty-icon">${icon}</div>
            <div class="empty-text">${text}</div>
        `;
        return div;
    },

    // 创建加载更多
    createLoadMore(text = '加载更多...') {
        const div = document.createElement('div');
        div.className = 'load-more';
        div.innerHTML = `
            <button class="btn btn-outline btn-block">${text}</button>
        `;
        return div;
    },

    // 创建分割线
    createDivider() {
        return document.createElement('div');
    },

    // 创建返回头部
    createBackBtn(onClick) {
        const btn = document.createElement('div');
        btn.className = 'page-back';
        btn.innerHTML = '←';
        btn.addEventListener('click', onClick);
        return btn;
    },

    // 创建页面头部
    createPageHeader(title, options = {}) {
        const { showBack = true, backUrl = null, rightAction = null } = options;

        const header = document.createElement('div');
        header.className = 'page-header';

        let backHtml = '';
        if (showBack) {
            backHtml = `<span class="page-back">←</span>`;
        }

        let rightHtml = '';
        if (rightAction) {
            rightHtml = `<span class="page-action">${rightAction.text}</span>`;
        }

        header.innerHTML = `
            ${backHtml}
            <span class="page-title">${title}</span>
            ${rightHtml}
        `;

        // 返回按钮事件
        if (showBack) {
            header.querySelector('.page-back').addEventListener('click', () => {
                if (backUrl) {
                    App.navigateTo(backUrl);
                } else {
                    App.navigateTo('home');
                }
            });
        }

        // 右侧操作事件
        if (rightAction) {
            header.querySelector('.page-action').addEventListener('click', rightAction.onClick);
        }

        return header;
    },

    // 创建筛选 Chip
    createFilterChips(options, selected, onChange) {
        const container = document.createElement('div');
        container.className = 'filter-chips';

        options.forEach(opt => {
            const chip = document.createElement('div');
            chip.className = `filter-chip ${selected === opt.value ? 'active' : ''}`;
            chip.textContent = opt.label;
            chip.dataset.value = opt.value;

            chip.addEventListener('click', () => {
                // 清除其他选中状态
                container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                onChange(opt.value);
            });

            container.appendChild(chip);
        });

        return container;
    },

    // 创建 Banner
    createBanner(data) {
        const banner = document.createElement('div');
        banner.className = 'banner';
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-title">${data.title}</div>
                <div class="banner-desc">${data.desc}</div>
            </div>
            <div class="banner-img" style="background: linear-gradient(135deg, ${data.color || '#FFF0EC'} 0%, ${data.colorEnd || '#FFE4D9'} 100%);"></div>
        `;
        return banner;
    },

    // 创建统计行
    createStatsRow(stats) {
        const row = document.createElement('div');
        row.className = 'stats-row';
        row.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${stats.available}</div>
                <div class="stat-label">待领养</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.adopted}</div>
                <div class="stat-label">已领养</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.users}</div>
                <div class="stat-label">爱心机构</div>
            </div>
        `;
        return row;
    },

    // 创建步骤指示器
    createStepIndicator(steps, currentStep) {
        const container = document.createElement('div');
        container.className = 'publish-step';

        steps.forEach((step, index) => {
            const stepNum = index + 1;
            let stepClass = 'step-item';
            if (stepNum < currentStep) {
                stepClass += ' done';
            } else if (stepNum === currentStep) {
                stepClass += ' active';
            }

            const lineHtml = index < steps.length - 1
                ? `<div class="step-line ${stepNum < currentStep ? 'done' : ''}"></div>`
                : '';

            container.innerHTML += `
                <div class="${stepClass}">
                    <div class="step-num">${stepNum < currentStep ? '✓' : stepNum}</div>
                    <span class="step-label">${step}</span>
                </div>
                ${lineHtml}
            `;
        });

        return container;
    },

    // 格式化日期
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;

        return `${date.getMonth() + 1}月${date.getDate()}日`;
    },

    // 格式化手机号
    formatPhone(phone) {
        if (!phone || phone.length !== 11) return phone;
        return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
};

// 工具函数
const Utils = {
    // 防抖
    debounce(fn, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    // 节流
    throttle(fn, delay) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    },

    // 复制到剪贴板
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            App.showToast('已复制到剪贴板');
            return true;
        } catch (err) {
            // 降级处理
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            App.showToast('已复制到剪贴板');
            return true;
        }
    }
};
