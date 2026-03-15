/**
 * 毛毛家 - API 请求封装
 * 连接到 Spring Boot 后端
 */

const API = {
    // API 基础 URL - 在生产环境修改为你的后端地址
    // 例如: 'https://your-backend.onrender.com' 或使用环境变量
    baseURL: window.API_URL || '',

    // 存储 token 的键名
    TOKEN_KEY: 'pets_token',
    USER_KEY: 'pets_user',

    // 获取 token
    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    // 设置 token
    setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    },

    // 移除 token
    removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    },

    // 获取当前用户
    getCurrentUser() {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // 设置当前用户
    setCurrentUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    // 移除当前用户
    removeCurrentUser() {
        localStorage.removeItem(this.USER_KEY);
    },

    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        const token = this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || '请求失败');
            }

            // 对于 204 No Content 返回 null
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // ========== 认证模块 ==========

    // 登录
    async login(phone, password) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone, password })
        });
        if (data) {
            this.setToken(data.token);
            this.setCurrentUser(data.user);
        }
        return data;
    },

    // 注册
    async register(nickname, phone, password, city) {
        const data = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ nickname, phone, password, city })
        });
        if (data) {
            this.setToken(data.token);
            this.setCurrentUser(data.user);
        }
        return data;
    },

    // 退出登录
    logout() {
        this.removeToken();
        this.removeCurrentUser();
    },

    // 检查是否已登录
    isLoggedIn() {
        return !!this.getToken() && !!this.getCurrentUser();
    },

    // ========== 用户模块 ==========

    // 获取用户信息
    async getUser(userId) {
        return await this.request(`/api/users/${userId}`);
    },

    // 更新用户信息
    async updateUser(userId, userData) {
        return await this.request(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // ========== 宠物模块 ==========

    // 获取宠物列表
    async getPets(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/api/pets?${queryString}` : '/api/pets';
        return await this.request(endpoint);
    },

    // 获取宠物详情
    async getPet(petId) {
        return await this.request(`/api/pets/${petId}`);
    },

    // 发布宠物
    async createPet(petData) {
        return await this.request('/api/pets', {
            method: 'POST',
            body: JSON.stringify(petData)
        });
    },

    // 更新宠物
    async updatePet(petId, petData) {
        return await this.request(`/api/pets/${petId}`, {
            method: 'PUT',
            body: JSON.stringify(petData)
        });
    },

    // 删除宠物
    async deletePet(petId) {
        return await this.request(`/api/pets/${petId}`, {
            method: 'DELETE'
        });
    },

    // 增加浏览量
    async incrementView(petId) {
        return await this.request(`/api/pets/${petId}/view`, {
            method: 'POST'
        });
    },

    // 获取用户发布的宠物
    async getUserPets(userId) {
        return await this.request(`/api/pets/user/${userId}`);
    },

    // ========== 领养模块 ==========

    // 提交领养申请
    async createAdoption(adoptionData) {
        return await this.request('/api/adoptions', {
            method: 'POST',
            body: JSON.stringify(adoptionData)
        });
    },

    // 获取我的申请
    async getMyAdoptions() {
        return await this.request('/api/adoptions');
    },

    // 获取收到的申请
    async getReceivedAdoptions() {
        return await this.request('/api/adoptions/received');
    },

    // 更新申请状态
    async updateAdoptionStatus(adoptionId, status) {
        return await this.request(`/api/adoptions/${adoptionId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    // ========== 消息模块 ==========

    // 获取会话列表
    async getConversations() {
        return await this.request('/api/conversations');
    },

    // 创建会话
    async createConversation(participantId, petId = null) {
        return await this.request('/api/conversations', {
            method: 'POST',
            body: JSON.stringify({ participantId, petId })
        });
    },

    // 获取会话消息
    async getMessages(conversationId) {
        return await this.request(`/api/conversations/${conversationId}/messages`);
    },

    // 发送消息
    async sendMessage(conversationId, receiverId, content, type = 'text', petId = null) {
        return await this.request('/api/messages', {
            method: 'POST',
            body: JSON.stringify({
                conversationId,
                receiverId,
                petId,
                type,
                content
            })
        });
    },

    // 标记消息已读
    async markMessagesRead(conversationId) {
        return await this.request(`/api/conversations/${conversationId}/read`, {
            method: 'PUT'
        });
    },

    // ========== 收藏模块 ==========

    // 获取收藏列表
    async getFavorites() {
        return await this.request('/api/favorites');
    },

    // 切换收藏
    async toggleFavorite(petId) {
        return await this.request('/api/favorites', {
            method: 'POST',
            body: JSON.stringify({ petId })
        });
    },

    // 检查是否收藏
    async checkFavorite(petId) {
        return await this.request(`/api/favorites/check/${petId}`);
    },

    // ========== 通知模块 ==========

    // 获取通知列表
    async getNotifications() {
        return await this.request('/api/notifications');
    },

    // 标记通知已读
    async markNotificationRead(notificationId) {
        return await this.request(`/api/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
    },

    // 获取未读通知数
    async getUnreadNotificationCount() {
        return await this.request('/api/notifications/unread-count');
    }
};

// 检查是否使用后端模式
const USE_API = true; // 设置为 false 可以回退到 localStorage 模式
