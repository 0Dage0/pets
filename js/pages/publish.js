/**
 * 毛毛家 - 发布宠物（4步骤）
 */

const PublishPage = {
    // 当前步骤
    currentStep: 1,
    // 宠物数据
    petData: {
        media: [],
        name: '',
        type: '',
        breed: '',
        gender: '',
        age: '',
        ageMonths: 0,
        city: '',
        traitTags: [],
        description: '',
        healthTags: [],
        requirements: [],
        requirementNote: ''
    },
    // 文件输入
    fileInput: null,

    // 步骤名称
    steps: ['基本信息', '健康档案', '领养要求', '确认发布'],

    // 渲染发布页面
    render(container) {
        container.innerHTML = '';

        // 页面头部
        const header = Components.createPageHeader('发布宠物', {
            showBack: true,
            backUrl: 'home'
        });
        container.appendChild(header);

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
        this.renderActions(container);
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
            case 4:
                this.renderStep4(container);
                break;
        }
    },

    // 步骤1：基本信息
    renderStep1(container) {
        const types = MockData.petTypes;
        const cities = MockData.cities;
        const breeds = MockData.breeds;

        container.innerHTML = `
            <div class="form-section">
                <div class="form-section-title">宠物照片</div>
                <div class="upload-area" id="uploadArea">
                    <div class="upload-icon">📷</div>
                    <div class="upload-text">点击上传宠物照片（最多4张）</div>
                </div>
                <input type="file" id="petPhotos" accept="image/*" multiple style="display: none;">
                <div class="upload-preview" id="uploadPreview"></div>
            </div>

            <div class="form-section">
                <div class="form-section-title">基本信息</div>

                <div class="form-group">
                    <label class="form-label">宠物名字 *</label>
                    <input type="text" class="form-input" id="petName" placeholder="给宠物起个名字" value="${this.petData.name}">
                </div>

                <div class="form-group">
                    <label class="form-label">宠物类型 *</label>
                    <div class="radio-group" id="petTypeGroup">
                        ${types.map(t => `
                            <label class="radio-item ${this.petData.type === t.value ? 'active' : ''}" data-value="${t.value}">
                                ${t.icon} ${t.label}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">品种</label>
                    <select class="form-input form-select" id="petBreed">
                        <option value="">请选择品种</option>
                        ${(breeds[this.petData.type] || breeds.dog).map(b => `
                            <option value="${b}" ${this.petData.breed === b ? 'selected' : ''}>${b}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">性别 *</label>
                    <div class="radio-group" id="petGenderGroup">
                        <label class="radio-item ${this.petData.gender === 'male' ? 'active' : ''}" data-value="male">
                            ♂️ 公
                        </label>
                        <label class="radio-item ${this.petData.gender === 'female' ? 'active' : ''}" data-value="female">
                            ♀️ 母
                        </label>
                        <label class="radio-item ${this.petData.gender === 'unknown' ? 'active' : ''}" data-value="unknown">
                            ❓ 不清楚
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">年龄 *</label>
                    <div class="form-row">
                        <select class="form-input form-select" id="petAgeYears">
                            <option value="0">不满1岁</option>
                            ${[1,2,3,4,5,6,7,8,9,10].map(y => `
                                <option value="${y}" ${this.petData.age && this.petData.age.includes(y + '岁') ? 'selected' : ''}>${y}岁</option>
                            `).join('')}
                            <option value="10+">10岁以上</option>
                        </select>
                        <select class="form-input form-select" id="petAgeMonths">
                            <option value="0">0个月</option>
                            ${[1,2,3,4,5,6,7,8,9,10,11].map(m => `
                                <option value="${m}" ${this.petData.age && this.petData.age.includes(m + '个月') ? 'selected' : ''}>${m}个月</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">所在城市 *</label>
                    <select class="form-input form-select" id="petCity">
                        <option value="">请选择城市</option>
                        ${cities.map(c => `
                            <option value="${c}" ${this.petData.city === c ? 'selected' : ''}>${c}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section-title">性格标签</div>
                <div class="checkbox-group" id="traitTagsGroup">
                    ${MockData.traitTags.map(tag => `
                        <div class="checkbox-item ${this.petData.traitTags.includes(tag.value) ? 'active' : ''}" data-value="${tag.value}">
                            ${tag.label}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="form-section">
                <div class="form-section-title">详细介绍</div>
                <div class="form-group">
                    <textarea class="form-input form-textarea" id="petDescription" placeholder="介绍一下宠物的性格、习惯、故事...">${this.petData.description}</textarea>
                </div>
            </div>
        `;

        // 绑定事件
        this.bindStep1Events(container);
    },

    // 绑定步骤1事件
    bindStep1Events(container) {
        // 上传图片
        const uploadArea = container.querySelector('#uploadArea');
        const fileInput = container.querySelector('#petPhotos');

        uploadArea.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // 宠物类型
        container.querySelectorAll('#petTypeGroup .radio-item').forEach(item => {
            item.addEventListener('click', () => {
                container.querySelectorAll('#petTypeGroup .radio-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.petData.type = item.dataset.value;
                this.petData.breed = '';

                // 更新品种选项
                const breedSelect = container.querySelector('#petBreed');
                const breeds = MockData.breeds[this.petData.type] || MockData.breeds.dog;
                breedSelect.innerHTML = `
                    <option value="">请选择品种</option>
                    ${breeds.map(b => `<option value="${b}">${b}</option>`).join('')}
                `;
            });
        });

        // 性别
        container.querySelectorAll('#petGenderGroup .radio-item').forEach(item => {
            item.addEventListener('click', () => {
                container.querySelectorAll('#petGenderGroup .radio-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.petData.gender = item.dataset.value;
            });
        });

        // 性格标签
        container.querySelectorAll('#traitTagsGroup .checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
                const value = item.dataset.value;
                if (item.classList.contains('active')) {
                    if (!this.petData.traitTags.includes(value)) {
                        this.petData.traitTags.push(value);
                    }
                } else {
                    this.petData.traitTags = this.petData.traitTags.filter(t => t !== value);
                }
            });
        });
    },

    // 处理文件上传
    handleFileUpload(files) {
        if (!files || files.length === 0) return;

        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        Array.from(files).slice(0, 4 - this.petData.media.length).forEach(file => {
            if (file.size > maxSize) {
                App.showToast('图片不能超过5MB', 'error');
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                App.showToast('只支持 JPG、PNG、GIF 格式', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.petData.media.push(e.target.result);
                this.updatePreview();
            };
            reader.readAsDataURL(file);
        });
    },

    // 更新预览
    updatePreview() {
        const preview = document.getElementById('uploadPreview');
        if (!preview) return;

        preview.innerHTML = this.petData.media.map((src, i) => `
            <div class="upload-preview-item">
                <img src="${src}" alt="预览">
                <div class="upload-preview-remove" data-index="${i}">×</div>
            </div>
        `).join('');

        // 删除按钮
        preview.querySelectorAll('.upload-preview-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.petData.media.splice(index, 1);
                this.updatePreview();
            });
        });
    },

    // 步骤2：健康档案
    renderStep2(container) {
        container.innerHTML = `
            <div class="form-section">
                <div class="form-section-title">健康状况</div>
                <div class="checkbox-group" id="healthTagsGroup">
                    ${MockData.healthTags.map(tag => `
                        <div class="checkbox-item ${this.petData.healthTags.includes(tag.value) ? 'active' : ''}" data-value="${tag.value}">
                            ${tag.icon} ${tag.label}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="form-section">
                <div class="form-section-title">其他说明</div>
                <div class="form-group">
                    <textarea class="form-input form-textarea" id="healthNote" placeholder="如有病史、特殊情况等请说明..."></textarea>
                </div>
            </div>
        `;

        // 绑定事件
        container.querySelectorAll('#healthTagsGroup .checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
                const value = item.dataset.value;
                if (item.classList.contains('active')) {
                    if (!this.petData.healthTags.includes(value)) {
                        this.petData.healthTags.push(value);
                    }
                } else {
                    this.petData.healthTags = this.petData.healthTags.filter(t => t !== value);
                }
            });
        });
    },

    // 步骤3：领养要求
    renderStep3(container) {
        container.innerHTML = `
            <div class="form-section">
                <div class="form-section-title">领养要求</div>
                <div class="checkbox-group" id="requirementsGroup">
                    ${MockData.requirementOptions.map(req => `
                        <div class="checkbox-item ${this.petData.requirements.includes(req) ? 'active' : ''}" data-value="${req}">
                            ${req}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="form-section">
                <div class="form-section-title">补充说明</div>
                <div class="form-group">
                    <textarea class="form-input form-textarea" id="requirementNote" placeholder="添加更多领养要求或说明...">${this.petData.requirementNote}</textarea>
                </div>
            </div>
        `;

        // 绑定事件
        container.querySelectorAll('#requirementsGroup .checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
                const value = item.dataset.value;
                if (item.classList.contains('active')) {
                    if (!this.petData.requirements.includes(value)) {
                        this.petData.requirements.push(value);
                    }
                } else {
                    this.petData.requirements = this.petData.requirements.filter(r => r !== value);
                }
            });
        });
    },

    // 步骤4：确认发布
    renderStep4(container) {
        const typeInfo = MockData.getPetTypeInfo(this.petData.type);

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">确认信息</span>
                </div>

                <div style="display: flex; gap: 16px; margin-bottom: 20px;">
                    <div style="width: 100px; height: 100px; border-radius: 10px; overflow: hidden; flex-shrink: 0;">
                        <img src="${this.petData.media[0] || ''}" alt="${this.petData.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;background:#EAE8E4;display:flex;align-items:center;justify-content:center;font-size:40px;\\'>${typeInfo.icon}</div>'">
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${this.petData.name || '未命名'}</div>
                        <div style="font-size: 14px; color: var(--ink-3);">
                            ${typeInfo.label} · ${this.petData.breed || '未知品种'} · ${this.petData.age || '未知年龄'}
                        </div>
                        <div style="font-size: 14px; color: var(--ink-3);">📍 ${this.petData.city || '未知城市'}</div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">性格标签</div>
                    <div class="desc-tags">
                        ${this.petData.traitTags.map(tag => `<span class="desc-tag">${tag}</span>`).join('') || '<span style="color: var(--ink-3);">未设置</span>'}
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">健康状态</div>
                    <div class="desc-tags">
                        ${this.petData.healthTags.map(tag => `<span class="desc-tag" style="background: #E8F5E9; color: #2E7D32;">${tag}</span>`).join('') || '<span style="color: var(--ink-3);">未设置</span>'}
                    </div>
                </div>

                <div>
                    <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">领养要求</div>
                    <div style="font-size: 14px; color: var(--ink-2);">
                        ${this.petData.requirements.length > 0 ? this.petData.requirements.join('、') : '未设置特殊要求'}
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 16px; background: var(--brand-light); border-radius: 10px;">
                <div style="font-size: 14px; color: var(--brand);">
                    💡 提示：发布后，您的宠物信息将在平台展示，等待爱心人士申请领养。
                </div>
            </div>
        `;
    },

    // 渲染操作按钮
    renderActions(container) {
        const actions = document.createElement('div');
        actions.className = 'publish-actions';

        if (this.currentStep === 1) {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" id="saveDraftBtn">保存草稿</button>
                <button class="btn btn-primary btn-lg" id="nextStepBtn">下一步</button>
            `;
        } else if (this.currentStep < 4) {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" id="prevStepBtn">上一步</button>
                <button class="btn btn-primary btn-lg" id="nextStepBtn">下一步</button>
            `;
        } else {
            actions.innerHTML = `
                <button class="btn btn-outline btn-lg" id="prevStepBtn">上一步</button>
                <button class="btn btn-success btn-lg" id="submitBtn">确认发布</button>
            `;
        }

        container.appendChild(actions);

        // 绑定按钮事件
        this.bindActionEvents(actions);
    },

    // 绑定操作按钮事件
    bindActionEvents(actions) {
        const prevBtn = actions.querySelector('#prevStepBtn');
        const nextBtn = actions.querySelector('#nextStepBtn');
        const submitBtn = actions.querySelector('#submitBtn');
        const saveDraftBtn = actions.querySelector('#saveDraftBtn');

        // 上一步
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentStep--;
                this.refresh();
            });
        }

        // 下一步
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.validateStep()) {
                    this.currentStep++;
                    this.refresh();
                }
            });
        }

        // 保存草稿
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => {
                App.showToast('草稿已保存');
                App.navigateTo('home');
            });
        }

        // 提交发布
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitPet();
            });
        }
    },

    // 验证当前步骤
    validateStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.petData.name.trim()) {
                    App.showToast('请输入宠物名字', 'warn');
                    return false;
                }
                if (!this.petData.type) {
                    App.showToast('请选择宠物类型', 'warn');
                    return false;
                }
                if (!this.petData.gender) {
                    App.showToast('请选择宠物性别', 'warn');
                    return false;
                }
                if (!this.petData.city) {
                    App.showToast('请选择所在城市', 'warn');
                    return false;
                }
                // 更新数据
                const nameInput = document.getElementById('petName');
                const ageYears = document.getElementById('petAgeYears');
                const ageMonths = document.getElementById('petAgeMonths');
                const breedSelect = document.getElementById('petBreed');
                const citySelect = document.getElementById('petCity');
                const descInput = document.getElementById('petDescription');

                if (nameInput) this.petData.name = nameInput.value;
                if (breedSelect) this.petData.breed = breedSelect.value;
                if (citySelect) this.petData.city = citySelect.value;

                // 计算年龄
                const years = parseInt(ageYears?.value || 0);
                const months = parseInt(ageMonths?.value || 0);
                this.petData.ageMonths = years * 12 + months;
                if (years === 0 && months === 0) {
                    this.petData.age = '幼崽';
                } else if (years === 0) {
                    this.petData.age = months + '个月';
                } else if (months === 0) {
                    this.petData.age = years + '岁';
                } else {
                    this.petData.age = years + '岁' + months + '个月';
                }

                if (descInput) this.petData.description = descInput.value;
                return true;

            case 2:
                const healthNote = document.getElementById('healthNote');
                if (healthNote && healthNote.value) {
                    this.petData.healthNote = healthNote.value;
                }
                return true;

            case 3:
                const requirementNote = document.getElementById('requirementNote');
                if (requirementNote && requirementNote.value) {
                    this.petData.requirementNote = requirementNote.value;
                }
                return true;

            default:
                return true;
        }
    },

    // 提交宠物
    async submitPet() {
        App.showLoading();

        try {
            // 尝试使用 API
            if (API.isLoggedIn()) {
                const pet = await API.createPet(this.petData);
                if (pet) {
                    App.hideLoading();
                    App.showToast('发布成功！', 'success');
                    setTimeout(() => {
                        App.navigateTo('home');
                    }, 1000);
                    return;
                }
            }
        } catch (e) {
            console.log('API createPet failed, using localStorage');
        }

        // Fallback to localStorage
        const pet = Store.createPet({
            ...this.petData,
            ownerId: App.currentUser.id
        });

        // 添加通知
        Store.addNotification(
            App.currentUser.id,
            'system',
            '发布成功',
            `您的宠物 ${pet.name} 已成功发布，等待爱心人士领养！`
        );

        App.hideLoading();

        App.showToast('发布成功！', 'success');

        // 跳转到首页
        setTimeout(() => {
            App.navigateTo('home');
        }, 1000);
    },

    // 刷新页面
    refresh() {
        const container = document.getElementById('page-publish');
        this.render(container);
    }
};
