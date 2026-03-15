/**
 * 毛毛家 - 宠物详情页
 */

const DetailPage = {
    // 当前宠物
    pet: null,
    // 当前轮播图索引
    currentSlide: 0,

    // 渲染详情页
    render(container, params) {
        const { petId } = params;
        if (!petId) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><div class="empty-text">宠物不存在</div></div>';
            return;
        }

        // 获取宠物数据
        this.pet = Store.getPetById(petId);
        if (!this.pet) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><div class="empty-text">宠物不存在</div></div>';
            return;
        }

        // 增加浏览量
        Store.incrementPetView(petId);

        // 获取发布者信息
        const owner = Store.getUserById(this.pet.ownerId);

        container.innerHTML = '';

        // 轮播图
        this.renderCarousel(container);

        // 基本信息
        this.renderInfo(container);

        // 健康档案
        this.renderHealth(container);

        // 性格描述
        this.renderDescription(container);

        // 领养要求
        this.renderRequirements(container);

        // 发布者信息
        if (owner) {
            this.renderOwner(container, owner);
        }

        // 底部操作栏
        this.renderActions(container);
    },

    // 渲染轮播图
    renderCarousel(container) {
        const carousel = document.createElement('div');
        carousel.className = 'detail-header';

        const images = this.pet.media && this.pet.media.length > 0
            ? this.pet.media
            : [MockData.getPetTypeInfo(this.pet.type).icon];

        carousel.innerHTML = `
            <div class="detail-carousel" id="detailCarousel">
                ${images.map((img, i) => `
                    <img src="${img}" alt="${this.pet.name}" style="display: ${i === 0 ? 'block' : 'none'}" data-index="${i}">
                `).join('')}
                ${images.length > 1 ? `
                    <div class="carousel-nav prev" id="carouselPrev">‹</div>
                    <div class="carousel-nav next" id="carouselNext">›</div>
                    <div class="carousel-dots">
                        ${images.map((_, i) => `<div class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        container.appendChild(carousel);

        // 轮播控制
        if (images.length > 1) {
            this.initCarousel(carousel, images.length);
        }
    },

    // 初始化轮播
    initCarousel(container, length) {
        const prevBtn = container.querySelector('#carouselPrev');
        const nextBtn = container.querySelector('#carouselNext');
        const dots = container.querySelectorAll('.carousel-dot');

        const showSlide = (index) => {
            const images = container.querySelectorAll('.detail-carousel img');
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            this.currentSlide = index;
        };

        prevBtn?.addEventListener('click', () => {
            const newIndex = this.currentSlide === 0 ? length - 1 : this.currentSlide - 1;
            showSlide(newIndex);
        });

        nextBtn?.addEventListener('click', () => {
            const newIndex = this.currentSlide === length - 1 ? 0 : this.currentSlide + 1;
            showSlide(newIndex);
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showSlide(i));
        });
    },

    // 渲染基本信息
    renderInfo(container) {
        const typeInfo = MockData.getPetTypeInfo(this.pet.type);
        const genderEmoji = this.pet.gender === 'male' ? '♂️' : this.pet.gender === 'female' ? '♀️' : '';

        const statusMap = {
            'available': { text: '待领养', class: '' },
            'applying': { text: '申请中', class: 'pending' },
            'handover': { text: '交接中', class: '' },
            'adopted': { text: '已领养', class: 'adopted' }
        };
        const status = statusMap[this.pet.status] || statusMap.available;

        const info = document.createElement('div');
        info.className = 'detail-info';
        info.innerHTML = `
            <div class="detail-title">
                ${this.pet.name}
                <span class="detail-gender">${genderEmoji}</span>
            </div>
            <div class="detail-tags">
                <span class="detail-tag">${typeInfo.label}</span>
                <span class="detail-tag">${this.pet.breed || '未知品种'}</span>
                <span class="detail-tag">${this.pet.age}</span>
                <span class="detail-tag">📍 ${this.pet.city}</span>
                <span class="detail-status ${status.class}">${status.text}</span>
            </div>
        `;

        container.appendChild(info);
    },

    // 渲染健康档案
    renderHealth(container) {
        const healthCard = document.createElement('div');
        healthCard.className = 'health-card';

        const healthItems = [
            {
                icon: '💉',
                label: '疫苗',
                status: this.pet.healthTags.includes('已接种疫苗') ? '已接种' : '未接种',
                done: this.pet.healthTags.includes('已接种疫苗')
            },
            {
                icon: '🏥',
                label: '绝育',
                status: this.pet.healthTags.includes('已绝育') ? '已绝育' : '未绝育',
                done: this.pet.healthTags.includes('已绝育')
            },
            {
                icon: '🪲',
                label: '驱虫',
                status: this.pet.healthTags.includes('已驱虫') ? '已驱虫' : '未驱虫',
                done: this.pet.healthTags.includes('已驱虫')
            }
        ];

        healthCard.innerHTML = `
            <div class="health-title">健康档案</div>
            <div class="health-grid">
                ${healthItems.map(item => `
                    <div class="health-item">
                        <div class="health-icon">${item.icon}</div>
                        <div class="health-label">${item.label}</div>
                        <div class="health-status ${item.done ? '' : 'no'}">${item.status}</div>
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(healthCard);
    },

    // 渲染性格描述
    renderDescription(container) {
        const descCard = document.createElement('div');
        descCard.className = 'desc-card';

        const traitHtml = this.pet.traitTags && this.pet.traitTags.length > 0
            ? `<div class="desc-tags">
                ${this.pet.traitTags.map(tag => `<span class="desc-tag">${tag}</span>`).join('')}
               </div>`
            : '';

        descCard.innerHTML = `
            <div class="desc-title">性格描述</div>
            <div class="desc-text">${this.pet.description || '暂无详细描述'}</div>
            ${traitHtml}
        `;

        container.appendChild(descCard);
    },

    // 渲染领养要求
    renderRequirements(container) {
        if (!this.pet.requirements || this.pet.requirements.length === 0) {
            return;
        }

        const reqCard = document.createElement('div');
        reqCard.className = 'requirements-card';
        reqCard.innerHTML = `
            <div class="requirements-title">领养要求</div>
            <div class="requirements-list">
                ${this.pet.requirements.map(req => `
                    <div class="requirement-item">
                        <span class="requirement-icon">✓</span>
                        <span>${req}</span>
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(reqCard);
    },

    // 渲染发布者信息
    renderOwner(container, owner) {
        const ownerCard = document.createElement('div');
        ownerCard.className = 'owner-card';
        ownerCard.innerHTML = `
            <div class="owner-header">
                <div class="owner-avatar">
                    <img src="${owner.avatar || defaultAvatars[0]}" alt="${owner.nickname}">
                </div>
                <div class="owner-info">
                    <div class="owner-name">${owner.nickname}</div>
                    <div class="owner-meta">${owner.city} · 发布于 ${Components.formatDate(this.pet.createdAt)}</div>
                </div>
            </div>
            <div class="owner-stats" style="display: flex; gap: 20px; margin-top: 12px;">
                <div style="text-align: center;">
                    <div style="font-weight: 600; color: var(--brand);">${owner.petCount || 0}</div>
                    <div style="font-size: 12px; color: var(--ink-3);">发布</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-weight: 600; color: var(--brand);">${owner.adoptCount || 0}</div>
                    <div style="font-size: 12px; color: var(--ink-3);">成功</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-weight: 600; color: var(--brand);">⭐ ${owner.rating || 5.0}</div>
                    <div style="font-size: 12px; color: var(--ink-3);">评分</div>
                </div>
            </div>
        `;

        container.appendChild(ownerCard);
    },

    // 渲染底部操作栏
    renderActions(container) {
        const isMyPet = App.currentUser && App.currentUser.id === this.pet.ownerId;
        const isAdopted = this.pet.status === 'adopted';

        const actions = document.createElement('div');
        actions.className = 'detail-actions';

        if (isAdopted) {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" disabled>已被领养</button>
            `;
        } else if (isMyPet) {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg">这是您的宠物</button>
            `;
        } else {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" id="contactBtn">💬 联系发布者</button>
                <button class="btn btn-primary btn-lg" id="adoptBtn">提交领养申请</button>
            `;
        }

        container.appendChild(actions);

        // 绑定事件
        const contactBtn = document.getElementById('contactBtn');
        const adoptBtn = document.getElementById('adoptBtn');

        if (contactBtn) {
            contactBtn.addEventListener('click', () => this.handleContact());
        }

        if (adoptBtn) {
            adoptBtn.addEventListener('click', () => this.handleAdopt());
        }

        // 确保底部有足够padding
        container.style.paddingBottom = '80px';
    },

    // 联系发布者
    handleContact() {
        if (!App.currentUser) {
            App.openAuthModal('login');
            return;
        }

        if (App.currentUser.id === this.pet.ownerId) {
            App.showToast('这是您发布的宠物');
            return;
        }

        // 创建或获取会话
        const conversation = Store.getOrCreateConversation(
            App.currentUser.id,
            this.pet.ownerId,
            this.pet.id
        );

        // 跳转到聊天页面
        App.navigateTo('chat', { conversationId: conversation.id });
    },

    // 申请领养
    handleAdopt() {
        if (!App.currentUser) {
            App.openAuthModal('login');
            return;
        }

        if (App.currentUser.id === this.pet.ownerId) {
            App.showToast('不能申请领养自己的宠物');
            return;
        }

        // 检查是否已有申请
        const existingAdoptions = Store.getUserAdoptions(App.currentUser.id);
        const hasApplied = existingAdoptions.some(a => a.petId === this.pet.id && ['pending', 'accepted'].includes(a.status));

        if (hasApplied) {
            App.showToast('您已申请过领养此宠物');
            return;
        }

        // 跳转到申请页面
        App.navigateTo('adopt', { petId: this.pet.id });
    }
};
