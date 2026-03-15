/**
 * 毛毛家 - 首页（发现）
 */

const HomePage = {
    // 当前筛选
    currentFilter: 'all',
    // 搜索关键词
    keyword: '',
    // 宠物列表
    pets: [],

    // 设置搜索关键词
    setKeyword(keyword) {
        this.keyword = keyword;
    },

    // 渲染首页
    render(container, options = {}) {
        const { explore = false } = options;

        container.innerHTML = '';

        // 筛选类型
        if (!explore) {
            this.renderFilters(container);
            this.renderBanner(container);
            this.renderStats(container);
        }

        // 标题
        const title = document.createElement('div');
        title.className = 'section';
        title.innerHTML = `<div class="section-header">
            <span class="section-title">${explore ? '搜索结果' : '发现宠物'}</span>
        </div>`;
        container.appendChild(title);

        // 宠物列表
        this.renderPetGrid(container, explore);
    },

    // 渲染筛选器
    renderFilters(container) {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-chips';

        const filters = [
            { value: 'all', label: '全部' },
            { value: 'dog', label: '🐕 狗狗' },
            { value: 'cat', label: '🐱 猫咪' },
            { value: 'rabbit', label: '🐰 兔子' },
            { value: 'hamster', label: '🐹 仓鼠' },
            { value: 'bird', label: '🐦 鸟类' },
            { value: 'fish', label: '🐟 鱼类' }
        ];

        filters.forEach(filter => {
            const chip = document.createElement('div');
            chip.className = `filter-chip ${this.currentFilter === filter.value ? 'active' : ''}`;
            chip.textContent = filter.label;
            chip.addEventListener('click', () => {
                // 更新选中状态
                filterContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                this.currentFilter = filter.value;
                this.refreshPetGrid(container);
            });
            filterContainer.appendChild(chip);
        });

        container.appendChild(filterContainer);
    },

    // 渲染Banner
    renderBanner(container) {
        const banner = Components.createBanner({
            title: '领养代替购买',
            desc: '每一只流浪动物都值得被爱',
            color: '#FFF0EC',
            colorEnd: '#FFE4D9'
        });
        container.appendChild(banner);
    },

    // 渲染统计
    renderStats(container) {
        const stats = Store.getStats();
        const statsData = {
            available: stats.totalPets,
            adopted: stats.totalAdopted,
            users: stats.totalUsers
        };
        const statsRow = Components.createStatsRow(statsData);
        container.appendChild(statsRow);
    },

    // 渲染宠物网格
    renderPetGrid(container, explore) {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'pet-grid';
        gridContainer.id = 'petGrid';
        container.appendChild(gridContainer);

        // 加载数据
        this.loadPets(gridContainer, explore);
    },

    // 加载宠物数据
    async loadPets(container, explore) {
        const filters = {
            type: this.currentFilter !== 'all' ? this.currentFilter : null,
            status: 'available'
        };

        if (explore || this.keyword) {
            filters.keyword = this.keyword;
        }

        // 尝试使用 API
        if (API.baseURL) {
            try {
                const params = {};
                if (filters.type) params.type = filters.type;
                if (filters.status) params.status = filters.status;
                if (filters.keyword) params.keyword = filters.keyword;
                params.size = 50;

                const pageData = await API.getPets(params);
                if (pageData && pageData.content) {
                    this.pets = pageData.content;
                }
            } catch (e) {
                console.log('API not available, using local data');
                this.pets = Store.getFilteredPets(filters);
            }
        } else {
            this.pets = Store.getFilteredPets(filters);
        }

        if (this.pets.length === 0) {
            const emptyState = Components.createEmptyState('🔍', explore ? '没有找到匹配的宠物' : '暂无待领养的宠物');
            container.appendChild(emptyState);
            return;
        }

        // 渲染卡片
        this.pets.forEach(pet => {
            const card = Components.createPetCard(pet);
            container.appendChild(card);
        });
    },

    // 刷新宠物网格
    refreshPetGrid() {
        const grid = document.getElementById('petGrid');
        if (!grid) return;

        grid.innerHTML = '';

        // 检查是否在探索页面
        const isExplore = document.getElementById('page-explore')?.classList.contains('active');

        this.loadPets(grid, isExplore);
    }
};
