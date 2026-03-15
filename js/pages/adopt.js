/**
 * 毛毛家 - 领养申请流程
 */

const AdoptPage = {
    // 当前步骤
    currentStep: 1,
    // 宠物数据
    pet: null,
    // 申请数据
    adoptionData: {
        realName: '',
        phone: '',
        age: '',
        profession: '',
        livingType: '',
        familyInfo: [],
        dailyHours: '',
        petExperience: '',
        motivation: '',
        commitments: []
    },
    // 步骤名称
    steps: ['个人信息', '生活情况', '确认承诺'],

    // 渲染申请页面
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

        container.innerHTML = '';

        // 页面头部
        const header = Components.createPageHeader('申请领养', {
            showBack: true,
            backUrl: 'detail',
            backParams: { petId }
        });
        container.appendChild(header);

        // 宠物信息卡片
        this.renderPetInfo(container);

        // 步骤指示器
        const stepIndicator = Components.createStepIndicator(this.steps, this.currentStep);
        stepIndicator.style.padding = '20px 16px';
        stepIndicator.style.background = '#fff';
        container.appendChild(stepIndicator);

        // 表单容器
        const formContainer = document.createElement('div');
        formContainer.className = 'publish-form';
        container.appendChild(formContainer);

        // 渲染当前步骤表单
        this.renderStepForm(formContainer);

        // 底部操作按钮
        this.renderActions(container, petId);
    },

    // 渲染宠物信息卡片
    renderPetInfo(container) {
        const typeInfo = MockData.getPetTypeInfo(this.pet.type);

        const petInfo = document.createElement('div');
        petInfo.className = 'adopt-pet-info';
        petInfo.innerHTML = `
            <div class="adopt-pet-img">
                <img src="${this.pet.media && this.pet.media.length > 0 ? this.pet.media[0] : ''}" alt="${this.pet.name}" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;background:#EAE8E4;display:flex;align-items:center;justify-content:center;font-size:30px;\\'>${typeInfo.icon}</div>'">
            </div>
            <div>
                <div class="adopt-pet-name">${this.pet.name}</div>
                <div class="adopt-pet-desc">${typeInfo.label} · ${this.pet.breed || '未知品种'} · ${this.pet.age}</div>
                <div class="adopt-pet-desc">📍 ${this.pet.city}</div>
            </div>
        `;

        container.appendChild(petInfo);
    },

    // 渲染当前步骤表单
    renderStepForm(container) {
        container.innerHTML = '';

        switch (this.currentStep) {
            case 1:
                this.renderStep1(container);
                break;
            case 2:
                this.renderStep2(container);
                break;
            case 3:
                this.renderStep3(container);
                break;
        }
    },

    // 步骤1：个人信息
    renderStep1(container) {
        container.innerHTML = `
            <div class="form-section">
                <div class="form-section-title">真实信息</div>
                <div class="form-group">
                    <label class="form-label">真实姓名 *</label>
                    <input type="text" class="form-input" id="realName" placeholder="请输入您的真实姓名" value="${this.adoptionData.realName}">
                </div>

                <div class="form-group">
                    <label class="form-label">联系电话 *</label>
                    <input type="tel" class="form-input" id="phone" placeholder="请输入您的联系电话" value="${this.adoptionData.phone || (App.currentUser ? App.currentUser.phone : '')}">
                </div>

                <div class="form-group">
                    <label class="form-label">年龄 *</label>
                    <input type="number" class="form-input" id="age" placeholder="请输入您的年龄" value="${this.adoptionData.age}">
                </div>

                <div class="form-group">
                    <label class="form-label">职业</label>
                    <input type="text" class="form-input" id="profession" placeholder="请输入您的职业" value="${this.adoptionData.profession}">
                </div>

                <div class="form-group">
                    <label class="form-label">居住情况 *</label>
                    <div class="radio-group" id="livingTypeGroup">
                        ${MockData.livingTypes.map(type => `
                            <label class="radio-item ${this.adoptionData.livingType === type.value ? 'active' : ''}" data-value="${type.value}">
                                ${type.label}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 绑定事件
        container.querySelectorAll('#livingTypeGroup .radio-item').forEach(item => {
            item.addEventListener('click', () => {
                container.querySelectorAll('#livingTypeGroup .radio-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.adoptionData.livingType = item.dataset.value;
            });
        });
    },

    // 步骤2：生活情况
    renderStep2(container) {
        container.innerHTML = `
            <div class="form-section">
                <div class="form-section-title">家庭情况</div>

                <div class="form-group">
                    <label class="form-label">家庭成员</label>
                    <div class="checkbox-group" id="familyInfoGroup">
                        ${MockData.familyOptions.map(info => `
                            <div class="checkbox-item ${this.adoptionData.familyInfo.includes(info) ? 'active' : ''}" data-value="${info}">
                                ${info}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">每日在家时长 *</label>
                    <div class="radio-group" id="dailyHoursGroup">
                        ${MockData.dailyHours.map(h => `
                            <label class="radio-item ${this.adoptionData.dailyHours === h.value ? 'active' : ''}" data-value="${h.value}">
                                ${h.label}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">养宠经历 *</label>
                    <select class="form-input form-select" id="petExperience">
                        <option value="">请选择</option>
                        ${MockData.experienceOptions.map(exp => `
                            <option value="${exp}" ${this.adoptionData.petExperience === exp ? 'selected' : ''}>${exp}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">领养动机 *</label>
                    <textarea class="form-input form-textarea" id="motivation" placeholder="请简要说明您想领养这只宠物的原因...">${this.adoptionData.motivation}</textarea>
                </div>
            </div>
        `;

        // 绑定事件
        container.querySelectorAll('#familyInfoGroup .checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
                const value = item.dataset.value;
                if (item.classList.contains('active')) {
                    if (!this.adoptionData.familyInfo.includes(value)) {
                        this.adoptionData.familyInfo.push(value);
                    }
                } else {
                    this.adoptionData.familyInfo = this.adoptionData.familyInfo.filter(f => f !== value);
                }
            });
        });

        container.querySelectorAll('#dailyHoursGroup .radio-item').forEach(item => {
            item.addEventListener('click', () => {
                container.querySelectorAll('#dailyHoursGroup .radio-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.adoptionData.dailyHours = item.dataset.value;
            });
        });
    },

    // 步骤3：确认承诺
    renderStep3(container) {
        container.innerHTML = `
            <div class="form-section">
                <div class="form-section-title">领养承诺</div>
                <div style="background: var(--brand-light); padding: 16px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="font-size: 14px; color: var(--brand);">
                        💡 请您仔细阅读以下承诺条款，确认后即可提交申请
                    </div>
                </div>

                <div class="requirements-list">
                    ${MockData.commitments.map((commitment, index) => `
                        <label class="requirement-item" style="cursor: pointer; padding: 12px; background: var(--bg); border-radius: 8px; margin-bottom: 8px;">
                            <input type="checkbox" class="commitment-checkbox" data-index="${index}" ${this.adoptionData.commitments.includes(index) ? 'checked' : ''} style="margin-right: 10px;">
                            <span>${commitment}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <div class="form-section">
                <div class="form-section-title">确认信息</div>
                <div style="font-size: 14px; color: var(--ink-2); line-height: 1.8;">
                    <p>申请人：<strong>${this.adoptionData.realName || '-'}</strong></p>
                    <p>电话：<strong>${this.adoptionData.phone || '-'}</strong></p>
                    <p>居住情况：<strong>${this.adoptionData.livingType || '-'}</strong></p>
                    <p>养宠经历：<strong>${this.adoptionData.petExperience || '-'}</strong></p>
                </div>
            </div>
        `;

        // 绑定事件
        container.querySelectorAll('.commitment-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const index = parseInt(checkbox.dataset.index);
                if (checkbox.checked) {
                    if (!this.adoptionData.commitments.includes(index)) {
                        this.adoptionData.commitments.push(index);
                    }
                } else {
                    this.adoptionData.commitments = this.adoptionData.commitments.filter(c => c !== index);
                }
            });
        });
    },

    // 渲染操作按钮
    renderActions(container, petId) {
        const actions = document.createElement('div');
        actions.className = 'publish-actions';

        if (this.currentStep === 1) {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" onclick="App.navigateTo('detail', {petId: '${petId}'})">取消</button>
                <button class="btn btn-primary btn-lg" id="nextStepBtn">下一步</button>
            `;
        } else if (this.currentStep < 3) {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" id="prevStepBtn">上一步</button>
                <button class="btn btn-primary btn-lg" id="nextStepBtn">下一步</button>
            `;
        } else {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" id="prevStepBtn">上一步</button>
                <button class="btn btn-success btn-lg" id="submitBtn">提交申请</button>
            `;
        }

        container.appendChild(actions);

        // 绑定按钮事件
        this.bindActionEvents(actions, petId);
    },

    // 绑定操作按钮事件
    bindActionEvents(actions, petId) {
        const prevBtn = actions.querySelector('#prevStepBtn');
        const nextBtn = actions.querySelector('#nextStepBtn');
        const submitBtn = actions.querySelector('#submitBtn');

        // 上一步
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentStep--;
                this.refresh(petId);
            });
        }

        // 下一步
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.validateStep()) {
                    this.currentStep++;
                    this.refresh(petId);
                }
            });
        }

        // 提交
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitAdoption(petId);
            });
        }
    },

    // 验证当前步骤
    validateStep() {
        switch (this.currentStep) {
            case 1:
                const realName = document.getElementById('realName')?.value.trim();
                const phone = document.getElementById('phone')?.value.trim();
                const age = document.getElementById('age')?.value.trim();
                const livingType = this.adoptionData.livingType;

                if (!realName) {
                    App.showToast('请输入真实姓名', 'warn');
                    return false;
                }
                if (!phone || !/^1\d{10}$/.test(phone)) {
                    App.showToast('请输入正确的手机号', 'warn');
                    return false;
                }
                if (!age) {
                    App.showToast('请输入年龄', 'warn');
                    return false;
                }
                if (!livingType) {
                    App.showToast('请选择居住情况', 'warn');
                    return false;
                }

                this.adoptionData.realName = realName;
                this.adoptionData.phone = phone;
                this.adoptionData.age = age;
                this.adoptionData.profession = document.getElementById('profession')?.value.trim() || '';
                return true;

            case 2:
                const dailyHours = this.adoptionData.dailyHours;
                const petExperience = document.getElementById('petExperience')?.value;
                const motivation = document.getElementById('motivation')?.value.trim();

                if (!dailyHours) {
                    App.showToast('请选择每日在家时长', 'warn');
                    return false;
                }
                if (!petExperience) {
                    App.showToast('请选择养宠经历', 'warn');
                    return false;
                }
                if (!motivation) {
                    App.showToast('请填写领养动机', 'warn');
                    return false;
                }

                this.adoptionData.petExperience = petExperience;
                this.adoptionData.motivation = motivation;
                return true;

            case 3:
                if (this.adoptionData.commitments.length < MockData.commitments.length) {
                    App.showToast('请确认所有承诺条款', 'warn');
                    return false;
                }
                return true;

            default:
                return true;
        }
    },

    // 提交申请
    submitAdoption(petId) {
        App.showLoading();

        // 创建领养申请
        const adoption = Store.createAdoption({
            petId: petId,
            applicantId: App.currentUser.id,
            ...this.adoptionData
        });

        // 通知发布者
        const pet = Store.getPetById(petId);
        if (pet) {
            Store.addNotification(
                pet.ownerId,
                'adoption',
                '新的领养申请',
                `有人申请领养您的宠物 ${pet.name}`,
                { adoptionId: adoption.id, petId: pet.id }
            );
        }

        // 通知申请人
        Store.addNotification(
            App.currentUser.id,
            'adoption',
            '申请已提交',
            `您已提交对 ${pet.name} 的领养申请，请等待发布者审核`,
            { adoptionId: adoption.id, petId: pet.id }
        );

        App.hideLoading();

        App.showToast('申请提交成功！', 'success');

        // 跳转到我的申请页面
        setTimeout(() => {
            App.navigateTo('profile');
        }, 1500);
    },

    // 刷新页面
    refresh(petId) {
        const container = document.getElementById('page-adopt');
        this.render(container, { petId });
    }
};
