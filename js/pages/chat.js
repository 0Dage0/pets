/**
 * 毛毛家 - 消息聊天系统
 */

const ChatPage = {
    // 当前会话
    currentConversation: null,
    // 消息列表
    messages: [],

    // 渲染消息页面
    render(container) {
        const user = App.currentUser;
        if (!user) {
            container.innerHTML = `
                <div class="login-prompt">
                    <div class="login-prompt-icon">💬</div>
                    <div class="login-prompt-text">登录后查看消息</div>
                    <button class="btn btn-primary" onclick="App.openAuthModal('login')">立即登录</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        // 页面头部
        const header = Components.createPageHeader('消息', {
            showBack: false
        });
        container.appendChild(header);

        // 获取会话列表
        const conversations = Store.getUserConversations(user.id);

        if (conversations.length === 0) {
            const emptyState = Components.createEmptyState('💬', '暂无消息');
            container.appendChild(emptyState);
            return;
        }

        // 渲染会话列表
        this.renderConversationList(container, conversations);
    },

    // 渲染会话列表
    renderConversationList(container, conversations) {
        const listContainer = document.createElement('div');
        listContainer.className = 'chat-list';

        const user = App.currentUser;

        conversations.forEach(conv => {
            // 获取对方信息
            const otherUserId = conv.participants.find(p => p !== user.id);
            const otherUser = Store.getUserById(otherUserId);

            // 获取宠物信息（如果有）
            let pet = null;
            if (conv.petId) {
                pet = Store.getPetById(conv.petId);
            }

            // 未读数
            const unreadCount = conv.unreadCount?.[user.id] || 0;

            const item = document.createElement('div');
            item.className = 'chat-item';
            item.dataset.conversationId = conv.id;

            item.innerHTML = `
                <div class="chat-avatar">
                    <img src="${otherUser?.avatar || defaultAvatars[0]}" alt="${otherUser?.nickname || '用户'}">
                    <span class="online-dot"></span>
                </div>
                <div class="chat-content">
                    <div class="chat-name">${otherUser?.nickname || '用户'}${pet ? ` · ${pet.name}` : ''}</div>
                    <div class="chat-preview">${conv.lastMessage || '暂无消息'}</div>
                </div>
                <div class="chat-meta">
                    <div class="chat-time">${Components.formatDate(conv.lastMessageAt)}</div>
                    ${unreadCount > 0 ? `<div class="chat-unread">${unreadCount}</div>` : ''}
                </div>
            `;

            // 点击进入聊天
            item.addEventListener('click', () => {
                App.navigateTo('chat', { conversationId: conv.id });
            });

            listContainer.appendChild(item);
        });

        container.appendChild(listContainer);
    },

    // 渲染聊天页面
    renderChatRoom(container, params) {
        const { conversationId } = params;
        if (!conversationId) {
            App.navigateTo('chat');
            return;
        }

        const user = App.currentUser;
        if (!user) {
            App.openAuthModal('login');
            return;
        }

        // 获取会话
        this.currentConversation = Store.getConversationById(conversationId);
        if (!this.currentConversation) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><div class="empty-text">会话不存在</div></div>';
            return;
        }

        // 标记消息已读
        Store.markMessagesRead(conversationId, user.id);

        // 获取对方信息
        const otherUserId = this.currentConversation.participants.find(p => p !== user.id);
        const otherUser = Store.getUserById(otherUserId);

        // 获取宠物信息
        let pet = null;
        if (this.currentConversation.petId) {
            pet = Store.getPetById(this.currentConversation.petId);
        }

        // 获取消息
        this.messages = Store.getMessages(conversationId);

        container.innerHTML = '';

        // 聊天头部
        const header = document.createElement('div');
        header.className = 'chat-room-header';
        header.innerHTML = `
            <span class="chat-room-back" onclick="App.navigateTo('chat')">←</span>
            <div class="chat-avatar" style="width: 36px; height: 36px;">
                <img src="${otherUser?.avatar || defaultAvatars[0]}" alt="${otherUser?.nickname || '用户'}">
            </div>
            <div class="chat-room-title">
                ${otherUser?.nickname || '用户'}${pet ? ` · ${pet.name}` : ''}
            </div>
            ${pet ? `<span class="page-action" id="viewPetBtn">查看宠物</span>` : ''}
        `;
        container.appendChild(header);

        // 消息区域
        const messagesContainer = document.createElement('div');
        messagesContainer.className = 'chat-room-messages';
        messagesContainer.id = 'chatMessages';
        container.appendChild(messagesContainer);

        // 渲染消息
        this.renderMessages(messagesContainer);

        // 输入区域
        const inputArea = document.createElement('div');
        inputArea.className = 'chat-input-area';
        inputArea.innerHTML = `
            <div class="chat-input-wrap">
                <textarea class="chat-input" id="messageInput" placeholder="发送消息..." rows="1"></textarea>
                <div class="chat-input-actions">
                    <span class="chat-input-btn" id="sendBtn">➤</span>
                </div>
            </div>
        `;
        container.appendChild(inputArea);

        // 绑定事件
        this.bindChatEvents(inputArea, otherUserId, pet);

        // 查看宠物按钮
        const viewPetBtn = header.querySelector('#viewPetBtn');
        if (viewPetBtn && pet) {
            viewPetBtn.addEventListener('click', () => {
                App.navigateTo('detail', { petId: pet.id });
            });
        }

        // 滚动到底部
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    },

    // 渲染消息
    renderMessages(container) {
        const user = App.currentUser;
        if (!user) return;

        container.innerHTML = '';

        this.messages.forEach(msg => {
            const isSelf = msg.senderId === user.id;
            const sender = Store.getUserById(msg.senderId);

            const messageEl = document.createElement('div');
            messageEl.className = `message ${isSelf ? 'self' : ''}`;

            // 根据消息类型渲染不同内容
            let contentHtml = '';
            switch (msg.type) {
                case 'text':
                    contentHtml = `<div class="message-bubble">${msg.content}</div>`;
                    break;
                case 'image':
                    contentHtml = `<div class="message-bubble"><img src="${msg.content}" style="max-width: 200px; border-radius: 8px;"></div>`;
                    break;
                case 'pet_card':
                    const pet = Store.getPetById(msg.petId);
                    if (pet) {
                        contentHtml = Components.createPetCardMessage(pet);
                    }
                    break;
                case 'system':
                    contentHtml = `<div class="message-bubble" style="background: var(--bg); color: var(--ink-3); font-size: 12px; text-align: center;">${msg.content}</div>`;
                    break;
            }

            messageEl.innerHTML = `
                <div class="message-avatar">
                    <img src="${sender?.avatar || defaultAvatars[0]}" alt="${sender?.nickname || '用户'}">
                </div>
                <div class="message-content">
                    ${contentHtml}
                    <div class="message-time">${Components.formatDate(msg.createdAt)}</div>
                </div>
            `;

            // 宠物卡片点击事件
            const petCard = messageEl.querySelector('.message-pet-card');
            if (petCard) {
                petCard.addEventListener('click', () => {
                    App.navigateTo('detail', { petId: msg.petId });
                });
            }

            container.appendChild(messageEl);
        });
    },

    // 绑定聊天事件
    bindChatEvents(inputArea, otherUserId, pet) {
        const messageInput = inputArea.querySelector('#messageInput');
        const sendBtn = inputArea.querySelector('#sendBtn');

        // 发送消息
        const sendMessage = () => {
            const content = messageInput.value.trim();
            if (!content) return;

            // 检查是否发送联系方式（防骚扰机制）
            const phonePattern = /1\d{10}|手机|电话|微信|QQ/;
            if (phonePattern.test(content)) {
                // 检查是否已确认领养
                if (pet) {
                    const adoptions = Store.getPetAdoptions(pet.id);
                    const confirmedAdoption = adoptions.find(a =>
                        (a.applicantId === App.currentUser.id || a.applicantId === otherUserId) &&
                        a.status === 'accepted'
                    );
                    if (!confirmedAdoption) {
                        App.showToast('双方确认领养前，禁止发送联系方式', 'warn');
                        return;
                    }
                }
            }

            // 发送消息
            Store.sendMessage(
                this.currentConversation.id,
                App.currentUser.id,
                'text',
                content
            );

            // 清空输入框
            messageInput.value = '';
            messageInput.style.height = 'auto';

            // 刷新消息列表
            this.messages = Store.getMessages(this.currentConversation.id);
            const messagesContainer = document.getElementById('chatMessages');
            this.renderMessages(messagesContainer);

            // 滚动到底部
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        };

        sendBtn.addEventListener('click', sendMessage);

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 自动调整输入框高度
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
        });
    },

    // 刷新聊天页面
    refresh(conversationId) {
        const container = document.getElementById('page-chat');
        this.renderChatRoom(container, { conversationId });
    }
};
