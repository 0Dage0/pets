/**
 * 毛毛家 - 数据存储管理
 * localStorage 数据层
 */

const Store = {
    // 存储键名
    KEYS: {
        USERS: 'pets_users',
        PETS: 'pets_list',
        ADOPTIONS: 'pets_adoptions',
        MESSAGES: 'pets_messages',
        CONVERSATIONS: 'pets_conversations',
        FAVORITES: 'pets_favorites',
        CURRENT_USER: 'pets_current_user',
        NOTIFICATIONS: 'pets_notifications'
    },

    // 初始化存储
    init() {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.PETS)) {
            localStorage.setItem(this.KEYS.PETS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.ADOPTIONS)) {
            localStorage.setItem(this.KEYS.ADOPTIONS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.MESSAGES)) {
            localStorage.setItem(this.KEYS.MESSAGES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.CONVERSATIONS)) {
            localStorage.setItem(this.KEYS.CONVERSATIONS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.FAVORITES)) {
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.NOTIFICATIONS)) {
            localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify([]));
        }
    },

    // 生成 UUID
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // 获取当前时间
    getTimestamp() {
        return new Date().toISOString();
    },

    // ========== 用户相关 ==========

    // 获取所有用户
    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
    },

    // 根据ID获取用户
    getUserById(userId) {
        const users = this.getUsers();
        return users.find(u => u.id === userId);
    },

    // 根据手机号获取用户
    getUserByPhone(phone) {
        const users = this.getUsers();
        return users.find(u => u.phone === phone);
    },

    // 创建用户
    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.generateId(),
            nickname: userData.nickname,
            avatar: userData.avatar || '',
            phone: userData.phone,
            city: userData.city || '',
            role: 'normal',
            createdAt: this.getTimestamp(),
            petCount: 0,
            adoptCount: 0,
            rating: 5.0
        };
        users.push(newUser);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
        return newUser;
    },

    // 更新用户
    updateUser(userId, userData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
            return users[index];
        }
        return null;
    },

    // 验证登录
    login(phone, password) {
        const users = this.getUsers();
        const user = users.find(u => u.phone === phone);
        if (user) {
            // 简单密码验证（实际项目中应该加密存储）
            const storedPassword = localStorage.getItem(`pets_pwd_${phone}`);
            if (storedPassword === password) {
                this.setCurrentUser(user);
                return user;
            }
        }
        return null;
    },

    // 注册
    register(nickname, phone, password, city) {
        // 检查手机号是否已注册
        if (this.getUserByPhone(phone)) {
            return { error: '该手机号已注册' };
        }

        // 创建用户
        const user = this.createUser({ nickname, phone, city });

        // 存储密码（实际项目中应该加密）
        localStorage.setItem(`pets_pwd_${phone}`, password);

        // 自动登录
        this.setCurrentUser(user);

        return user;
    },

    // 获取当前登录用户
    getCurrentUser() {
        const userId = localStorage.getItem(this.KEYS.CURRENT_USER);
        if (userId) {
            return this.getUserById(userId);
        }
        return null;
    },

    // 设置当前用户
    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.KEYS.CURRENT_USER, user.id);
        } else {
            localStorage.removeItem(this.KEYS.CURRENT_USER);
        }
    },

    // 退出登录
    logout() {
        this.setCurrentUser(null);
    },

    // ========== 宠物相关 ==========

    // 获取所有宠物
    getPets() {
        return JSON.parse(localStorage.getItem(this.KEYS.PETS) || '[]');
    },

    // 根据ID获取宠物
    getPetById(petId) {
        const pets = this.getPets();
        return pets.find(p => p.id === petId);
    },

    // 获取宠物的筛选列表
    getFilteredPets(filters = {}) {
        let pets = this.getPets();

        // 过滤状态（默认显示待领养的）
        if (filters.status) {
            pets = pets.filter(p => p.status === filters.status);
        } else {
            pets = pets.filter(p => ['available', 'applying', 'handover', 'adopted'].includes(p.status));
        }

        // 过滤类型
        if (filters.type && filters.type !== 'all') {
            pets = pets.filter(p => p.type === filters.type);
        }

        // 搜索关键词
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            pets = pets.filter(p =>
                p.name.toLowerCase().includes(keyword) ||
                p.breed.toLowerCase().includes(keyword) ||
                p.city.toLowerCase().includes(keyword)
            );
        }

        // 过滤用户发布的
        if (filters.ownerId) {
            pets = pets.filter(p => p.ownerId === filters.ownerId);
        }

        // 排序
        if (filters.sort === 'newest') {
            pets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filters.sort === 'popular') {
            pets.sort((a, b) => (b.favCount || 0) - (a.favCount || 0));
        }

        return pets;
    },

    // 创建宠物
    createPet(petData) {
        const pets = this.getPets();
        const newPet = {
            id: this.generateId(),
            name: petData.name,
            type: petData.type,
            breed: petData.breed || '',
            age: petData.age,
            ageMonths: petData.ageMonths || 0,
            gender: petData.gender,
            city: petData.city,
            status: 'available',
            healthTags: petData.healthTags || [],
            traitTags: petData.traitTags || [],
            description: petData.description || '',
            requirements: petData.requirements || [],
            media: petData.media || [],
            ownerId: petData.ownerId,
            viewCount: 0,
            favCount: 0,
            createdAt: this.getTimestamp()
        };
        pets.unshift(newPet);
        localStorage.setItem(this.KEYS.PETS, JSON.stringify(pets));

        // 更新用户发布数量
        const user = this.getUserById(petData.ownerId);
        if (user) {
            this.updateUser(user.id, { petCount: (user.petCount || 0) + 1 });
        }

        return newPet;
    },

    // 更新宠物
    updatePet(petId, petData) {
        const pets = this.getPets();
        const index = pets.findIndex(p => p.id === petId);
        if (index !== -1) {
            pets[index] = { ...pets[index], ...petData };
            localStorage.setItem(this.KEYS.PETS, JSON.stringify(pets));
            return pets[index];
        }
        return null;
    },

    // 删除宠物
    deletePet(petId) {
        const pets = this.getPets();
        const pet = pets.find(p => p.id === petId);
        if (pet) {
            const newPets = pets.filter(p => p.id !== petId);
            localStorage.setItem(this.KEYS.PETS, JSON.stringify(newPets));

            // 更新用户发布数量
            const user = this.getUserById(pet.ownerId);
            if (user) {
                this.updateUser(user.id, { petCount: Math.max(0, (user.petCount || 1) - 1) });
            }

            return true;
        }
        return false;
    },

    // 增加宠物浏览量
    incrementPetView(petId) {
        const pets = this.getPets();
        const index = pets.findIndex(p => p.id === petId);
        if (index !== -1) {
            pets[index].viewCount = (pets[index].viewCount || 0) + 1;
            localStorage.setItem(this.KEYS.PETS, JSON.stringify(pets));
        }
    },

    // 增加宠物收藏数
    incrementPetFav(petId) {
        const pets = this.getPets();
        const index = pets.findIndex(p => p.id === petId);
        if (index !== -1) {
            pets[index].favCount = (pets[index].favCount || 0) + 1;
            localStorage.setItem(this.KEYS.PETS, JSON.stringify(pets));
        }
    },

    // ========== 收藏相关 ==========

    // 获取用户收藏
    getFavorites(userId) {
        const favorites = JSON.parse(localStorage.getItem(this.KEYS.FAVORITES) || '[]');
        return favorites.filter(f => f.userId === userId);
    },

    // 检查是否收藏
    isFavorited(userId, petId) {
        const favorites = this.getFavorites(userId);
        return favorites.some(f => f.petId === petId);
    },

    // 切换收藏
    toggleFavorite(userId, petId) {
        const favorites = JSON.parse(localStorage.getItem(this.KEYS.FAVORITES) || '[]');
        const index = favorites.findIndex(f => f.userId === userId && f.petId === petId);

        if (index !== -1) {
            // 取消收藏
            favorites.splice(index, 1);
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
            return false;
        } else {
            // 添加收藏
            favorites.push({
                userId,
                petId,
                createdAt: this.getTimestamp()
            });
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
            this.incrementPetFav(petId);
            return true;
        }
    },

    // ========== 领养申请相关 ==========

    // 获取所有领养申请
    getAdoptions() {
        return JSON.parse(localStorage.getItem(this.KEYS.ADOPTIONS) || '[]');
    },

    // 根据ID获取领养申请
    getAdoptionById(adoptionId) {
        const adoptions = this.getAdoptions();
        return adoptions.find(a => a.id === adoptionId);
    },

    // 获取宠物的领养申请
    getPetAdoptions(petId) {
        const adoptions = this.getAdoptions();
        return adoptions.filter(a => a.petId === petId);
    },

    // 获取用户的领养申请
    getUserAdoptions(userId) {
        const adoptions = this.getAdoptions();
        return adoptions.filter(a => a.applicantId === userId);
    },

    // 获取用户收到的申请
    getReceivedAdoptions(userId) {
        const pets = this.getPets().filter(p => p.ownerId === userId);
        const petIds = pets.map(p => p.id);
        const adoptions = this.getAdoptions();
        return adoptions.filter(a => petIds.includes(a.petId));
    },

    // 创建领养申请
    createAdoption(adoptionData) {
        const adoptions = this.getAdoptions();
        const newAdoption = {
            id: this.generateId(),
            petId: adoptionData.petId,
            applicantId: adoptionData.applicantId,
            status: 'pending',
            realName: adoptionData.realName,
            phone: adoptionData.phone,
            age: adoptionData.age,
            profession: adoptionData.profession || '',
            livingType: adoptionData.livingType,
            familyInfo: adoptionData.familyInfo || [],
            dailyHours: adoptionData.dailyHours || '',
            petExperience: adoptionData.petExperience || '',
            motivation: adoptionData.motivation || '',
            commitments: adoptionData.commitments || [],
            createdAt: this.getTimestamp()
        };
        adoptions.push(newAdoption);
        localStorage.setItem(this.KEYS.ADOPTIONS, JSON.stringify(adoptions));

        // 更新宠物状态
        this.updatePet(adoptionData.petId, { status: 'applying' });

        return newAdoption;
    },

    // 更新领养申请状态
    updateAdoptionStatus(adoptionId, status) {
        const adoptions = this.getAdoptions();
        const index = adoptions.findIndex(a => a.id === adoptionId);
        if (index !== -1) {
            adoptions[index].status = status;
            localStorage.setItem(this.KEYS.ADOPTIONS, JSON.stringify(adoptions));

            // 如果接受申请，更新宠物状态
            if (status === 'accepted') {
                const adoption = adoptions[index];
                this.updatePet(adoption.petId, { status: 'handover' });
            }

            // 如果完成领养，更新宠物和用户状态
            if (status === 'completed') {
                const adoption = adoptions[index];
                this.updatePet(adoption.petId, { status: 'adopted' });

                // 更新领养者成功领养数
                const user = this.getUserById(adoption.applicantId);
                if (user) {
                    this.updateUser(user.id, { adoptCount: (user.adoptCount || 0) + 1 });
                }

                // 更新发布者成功送养数
                const pet = this.getPetById(adoption.petId);
                if (pet) {
                    const owner = this.getUserById(pet.ownerId);
                    if (owner) {
                        this.updateUser(owner.id, { adoptCount: (owner.adoptCount || 0) + 1 });
                    }
                }
            }

            return adoptions[index];
        }
        return null;
    },

    // ========== 消息相关 ==========

    // 获取所有会话
    getConversations() {
        return JSON.parse(localStorage.getItem(this.KEYS.CONVERSATIONS) || '[]');
    },

    // 获取用户的会话列表
    getUserConversations(userId) {
        const conversations = this.getConversations();
        return conversations
            .filter(c => c.participants.includes(userId))
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    },

    // 获取或创建会话
    getOrCreateConversation(userId, otherUserId, petId = null) {
        let conversations = this.getConversations();

        // 查找现有会话
        let conversation = conversations.find(c =>
            c.participants.includes(userId) &&
            c.participants.includes(otherUserId) &&
            (c.petId === petId || (!c.petId && !petId))
        );

        if (!conversation) {
            conversation = {
                id: this.generateId(),
                participants: [userId, otherUserId],
                petId: petId,
                lastMessage: '',
                lastMessageAt: this.getTimestamp(),
                unreadCount: {}
            };
            conversations.push(conversation);
            localStorage.setItem(this.KEYS.CONVERSATIONS, JSON.stringify(conversations));
        }

        return conversation;
    },

    // 获取会话详情
    getConversationById(conversationId) {
        const conversations = this.getConversations();
        return conversations.find(c => c.id === conversationId);
    },

    // 获取会话消息
    getMessages(conversationId) {
        const messages = JSON.parse(localStorage.getItem(this.KEYS.MESSAGES) || '[]');
        return messages
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    // 发送消息
    sendMessage(conversationId, senderId, type, content, extra = {}) {
        const messages = JSON.parse(localStorage.getItem(this.KEYS.MESSAGES) || '[]');

        const newMessage = {
            id: this.generateId(),
            conversationId,
            senderId,
            type, // text, image, pet_card, system
            content,
            readAt: null,
            createdAt: this.getTimestamp(),
            ...extra
        };

        messages.push(newMessage);
        localStorage.setItem(this.KEYS.MESSAGES, JSON.stringify(messages));

        // 更新会话最后消息
        const conversations = this.getConversations();
        const index = conversations.findIndex(c => c.id === conversationId);
        if (index !== -1) {
            const otherUserId = conversations[index].participants.find(p => p !== senderId);
            conversations[index].lastMessage = type === 'text' ? content : `[${type === 'image' ? '图片' : '宠物卡片'}]`;
            conversations[index].lastMessageAt = newMessage.createdAt;
            conversations[index].unreadCount = conversations[index].unreadCount || {};
            conversations[index].unreadCount[otherUserId] = (conversations[index].unreadCount[otherUserId] || 0) + 1;
            localStorage.setItem(this.KEYS.CONVERSATIONS, JSON.stringify(conversations));
        }

        return newMessage;
    },

    // 标记消息为已读
    markMessagesRead(conversationId, userId) {
        const messages = JSON.parse(localStorage.getItem(this.KEYS.MESSAGES) || '[]');
        let hasUnread = false;

        messages.forEach(m => {
            if (m.conversationId === conversationId && m.senderId !== userId && !m.readAt) {
                m.readAt = this.getTimestamp();
                hasUnread = true;
            }
        });

        if (hasUnread) {
            localStorage.setItem(this.KEYS.MESSAGES, JSON.stringify(messages));

            // 清零未读数
            const conversations = this.getConversations();
            const index = conversations.findIndex(c => c.id === conversationId);
            if (index !== -1) {
                conversations[index].unreadCount = conversations[index].unreadCount || {};
                conversations[index].unreadCount[userId] = 0;
                localStorage.setItem(this.KEYS.CONVERSATIONS, JSON.stringify(conversations));
            }
        }
    },

    // 获取未读消息总数
    getTotalUnreadCount(userId) {
        const conversations = this.getUserConversations(userId);
        let total = 0;
        conversations.forEach(c => {
            total += c.unreadCount?.[userId] || 0;
        });
        return total;
    },

    // ========== 通知相关 ==========

    // 获取用户通知
    getNotifications(userId) {
        const notifications = JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]');
        return notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // 添加通知
    addNotification(userId, type, title, content, extra = {}) {
        const notifications = JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]');
        notifications.push({
            id: this.generateId(),
            userId,
            type, // system, adoption, message
            title,
            content,
            readAt: null,
            createdAt: this.getTimestamp(),
            ...extra
        });
        localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    },

    // 标记通知为已读
    markNotificationRead(notificationId) {
        const notifications = JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || '[]');
        const index = notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            notifications[index].readAt = this.getTimestamp();
            localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        }
    },

    // 获取未读通知数
    getUnreadNotificationCount(userId) {
        const notifications = this.getNotifications(userId);
        return notifications.filter(n => !n.readAt).length;
    },

    // ========== 统计数据 ==========

    // 获取平台统计
    getStats() {
        const pets = this.getPets();
        const adoptions = this.getAdoptions();
        const users = this.getUsers();

        return {
            totalPets: pets.filter(p => p.status === 'available').length,
            totalAdopted: pets.filter(p => p.status === 'adopted').length,
            totalUsers: users.length
        };
    }
};

// 初始化存储
Store.init();
