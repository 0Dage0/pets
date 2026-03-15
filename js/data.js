/**
 * 毛毛家 - 模拟初始数据
 */

const MockData = {
    // 宠物类型
    petTypes: [
        { value: 'dog', label: '狗狗', icon: '🐕' },
        { value: 'cat', label: '猫咪', icon: '🐱' },
        { value: 'rabbit', label: '兔子', icon: '🐰' },
        { value: 'hamster', label: '仓鼠', icon: '🐹' },
        { value: 'bird', label: '鸟类', icon: '🐦' },
        { value: 'fish', label: '鱼类', icon: '🐟' }
    ],

    // 宠物品种
    breeds: {
        dog: ['中华田园犬', '金毛', '泰迪', '柯基', '哈士奇', '拉布拉多', '萨摩耶', '边牧', '柴犬', '阿拉斯加', '博美', '吉娃娃', '比熊', '雪纳瑞', '其它'],
        cat: ['中华田园猫', '英短', '美短', '暹罗', '波斯', '加菲', '布偶', '缅因', '豹猫', '无毛猫', '其它'],
        rabbit: ['垂耳兔', '侏儒兔', '安哥拉兔', '狮子兔', '其它'],
        hamster: ['仓鼠', '金丝熊', '公婆鼠', '其它'],
        bird: ['鹦鹉', '文鸟', '玄凤', '画眉', '八哥', '其它'],
        fish: ['金鱼', '锦鲤', '热带鱼', '其它']
    },

    // 城市列表
    cities: [
        '北京市', '上海市', '广州市', '深圳市', '杭州市',
        '南京市', '武汉市', '成都市', '重庆市', '西安市',
        '天津市', '苏州市', '郑州市', '长沙市', '沈阳市',
        '青岛市', '济南市', '大连市', '哈尔滨市', '厦门市',
        '宁波市', '无锡市', '佛山市', '东莞市', '昆明市'
    ],

    // 健康标签
    healthTags: [
        { value: '已接种疫苗', label: '已接种疫苗', icon: '💉' },
        { value: '已绝育', label: '已绝育', icon: '🏥' },
        { value: '已驱虫', label: '已驱虫', icon: '🪲' },
        { value: '已体检', label: '已体检', icon: '📋' }
    ],

    // 性格标签
    traitTags: [
        { value: '温顺', label: '温顺' },
        { value: '亲人', label: '亲人' },
        { value: '活泼', label: '活泼' },
        { value: '粘人', label: '粘人' },
        { value: '聪明', label: '聪明' },
        { value: '忠诚', label: '忠诚' },
        { value: '独立', label: '独立' },
        { value: '好动', label: '好动' },
        { value: '安静', label: '安静' },
        { value: '胆小', label: '胆小' }
    ],

    // 领养要求选项
    requirementOptions: [
        '有固定住所',
        '经济稳定',
        '家人同意',
        '领养不转卖',
        '定期回访',
        '签订协议',
        '绝育押金',
        '上门拜访'
    ],

    // 居住类型
    livingTypes: [
        { value: '自有房产', label: '自有房产' },
        { value: '租房', label: '租房' },
        { value: '与家人同住', label: '与家人同住' },
        { value: '宿舍', label: '宿舍' }
    ],

    // 家庭成员选项
    familyOptions: [
        '独居',
        '配偶',
        '子女',
        '父母',
        '合租'
    ],

    // 在家时长
    dailyHours: [
        { value: '少于4小时', label: '少于4小时' },
        { value: '4-8小时', label: '4-8小时' },
        { value: '8-12小时', label: '8-12小时' },
        { value: '12小时以上', label: '12小时以上' }
    ],

    // 养宠经历
    experienceOptions: [
        '从未养过',
        '养过1-3年',
        '养过3-5年',
        '养过5年以上'
    ],

    // 领养承诺
    commitments: [
        '真心喜爱宠物，不因搬家、结婚、生子等原因遗弃',
        '为宠物提供适合的科学喂养',
        '定期带宠物进行健康检查和疫苗注射',
        '接受送养人的回访和咨询'
    ],

    // 生成随机宠物数据
    generatePets(count = 20) {
        const pets = [];
        const statuses = ['available', 'available', 'available', 'available', 'adopted', 'applying'];

        for (let i = 0; i < count; i++) {
            const type = this.petTypes[Math.floor(Math.random() * this.petTypes.length)];
            const breedOptions = this.breeds[type.value];
            const breed = breedOptions[Math.floor(Math.random() * breedOptions.length)];
            const gender = ['male', 'female', 'unknown'][Math.floor(Math.random() * 3)];
            const ageMonths = Math.floor(Math.random() * 60) + 1;
            const age = ageMonths < 12 ? `${ageMonths}个月` : `${Math.floor(ageMonths / 12)}岁${ageMonths % 12 ? ageMonths % 12 + '个月' : ''}`;

            const traitCount = Math.floor(Math.random() * 4) + 1;
            const selectedTraits = [];
            while (selectedTraits.length < traitCount) {
                const tag = this.traitTags[Math.floor(Math.random() * this.traitTags.length)];
                if (!selectedTraits.includes(tag.value)) {
                    selectedTraits.push(tag.value);
                }
            }

            const healthCount = Math.floor(Math.random() * 3) + 1;
            const selectedHealth = [];
            while (selectedHealth.length < healthCount) {
                const tag = this.healthTags[Math.floor(Math.random() * this.healthTags.length)];
                if (!selectedHealth.includes(tag.value)) {
                    selectedHealth.push(tag.value);
                }
            }

            const reqCount = Math.floor(Math.random() * 4) + 2;
            const selectedReqs = [];
            while (selectedReqs.length < reqCount) {
                const req = this.requirementOptions[Math.floor(Math.random() * this.requirementOptions.length)];
                if (!selectedReqs.includes(req)) {
                    selectedReqs.push(req);
                }
            }

            // 模拟用户ID（稍后会创建）
            const ownerId = `user_${(i % 5) + 1}`;

            pets.push({
                id: `pet_${i + 1}`,
                name: this.getRandomName(type.value, i),
                type: type.value,
                breed: breed,
                age: age,
                ageMonths: ageMonths,
                gender: gender,
                city: this.cities[Math.floor(Math.random() * this.cities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                healthTags: selectedHealth,
                traitTags: selectedTraits,
                description: this.getRandomDescription(type.value, selectedTraits),
                requirements: selectedReqs,
                media: this.getRandomImages(type.value, i),
                ownerId: ownerId,
                viewCount: Math.floor(Math.random() * 500),
                favCount: Math.floor(Math.random() * 50),
                createdAt: this.getRandomDate(30)
            });
        }

        return pets;
    },

    // 获取随机名字
    getRandomName(type, index) {
        const names = {
            dog: ['豆豆', '旺财', '小米', '布丁', '可乐', '团子', 'Lucky', '哈皮', '笨笨', '小黑', '小白', '灰灰', '花花', '小虎', '大黄'],
            cat: ['咪咪', '小橘', '糖糖', '毛球', '雪球', '小虎', '酸奶', '布丁', '团子', '小七', '果冻', '小咪', '花花', '黑豆', '白豆'],
            rabbit: ['小白', '灰灰', '团子', '毛球', '棉花', '雪球', '小灰', '跳跳', '萌萌', '豆豆'],
            hamster: ['小布', '圆圆', '豆豆', '胖胖', '小灰', '小白', '花子', '米米'],
            bird: ['小蓝', '小绿', '小黄', '灰灰', '小白', '鹦鹉', '八哥', '文文'],
            fish: ['小金', '小红', '小黒', '锦鲤', '小蓝', '小青', '泡泡', '小银']
        };

        const typeNames = names[type] || names.dog;
        return typeNames[index % typeNames.length];
    },

    // 获取随机描述
    getRandomDescription(type, traits) {
        const descriptions = {
            dog: [
                '一只非常可爱的狗狗，性格温顺亲人，已完成基础训练。非常聪明，学东西很快，希望能找到一个爱它的家庭。',
                '活泼可爱的小狗，喜欢和人玩耍，对人友好。已接种疫苗，定期驱虫，身体健康。',
                '忠诚勇敢的狗狗，会看家护院，对主人忠诚。适合有院子或者喜欢运动的家庭。'
            ],
            cat: [
                '超级粘人的小猫咪，喜欢让人抚摸。性格安静，适合在公寓里饲养。',
                '好奇宝宝，对什么都感兴趣。已学会使用猫砂，非常爱干净。',
                '软萌软萌的小猫咪，颜值超高。性格独立又亲人，是个贴心的小棉袄。'
            ],
            rabbit: [
                '超级可爱的兔子，毛茸茸的，手感特别好。性格温顺，可以放心让小朋友接触。',
                '活泼好动的小兔子，喜欢跳来跳去。已学会定点上厕所，非常聪明。'
            ],
            hamster: [
                '胖嘟嘟的小仓鼠，特别可爱。晚上会比较活跃，白天睡觉。饲养简单，适合新手。',
                '性格温顺的仓鼠，不咬人。喜欢跑轮子，运动量很大。'
            ],
            bird: [
                '歌声动听的小鸟，每天早上都会唱歌把人叫醒。智商高，可以学会说话。',
                '颜色漂亮的鹦鹉，性格活泼。喜欢和人互动，是很好的宠物伴侣。'
            ],
            fish: [
                '色彩鲜艳的观赏鱼，非常好养。只需要定期换水喂食即可。',
                '漂亮的锦鲤，寓意好又好看。适合有庭院或者大鱼缸的家庭。'
            ]
        };

        const typeDesc = descriptions[type] || descriptions.dog;
        return typeDesc[Math.floor(Math.random() * typeDesc.length)];
    },

    // 获取随机图片
    getRandomImages(type, index) {
        // 使用 Unsplash 的占位图服务
        const images = {
            dog: [
                'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
                'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
                'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
                'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400'
            ],
            cat: [
                'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
                'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400',
                'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400',
                'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
                'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400'
            ],
            rabbit: [
                'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
                'https://images.unsplash.com/photo-1535241749838-299a630d7faf?w=400',
                'https://images.unsplash.com/photo-1591382696684-38c427c7547a?w=400',
                'https://images.unsplash.com/photo-1559214369-a6b1d7919865?w=400'
            ],
            hamster: [
                'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
                'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400'
            ],
            bird: [
                'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400',
                'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
                'https://images.unsplash.com/photo-1497752531616-c3aa53b718a0?w=400'
            ],
            fish: [
                'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400',
                'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=400',
                'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400'
            ]
        };

        const typeImages = images[type] || images.dog;
        const imgCount = Math.floor(Math.random() * 3) + 1;
        const result = [];

        for (let i = 0; i < imgCount; i++) {
            const imgIndex = (index + i) % typeImages.length;
            result.push(typeImages[imgIndex]);
        }

        return result;
    },

    // 获取随机日期（天数范围内）
    getRandomDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
        return date.toISOString();
    },

    // 初始化演示用户
    initDemoUsers() {
        const users = Store.getUsers();

        if (users.length === 0) {
            // 创建演示用户
            const demoUsers = [
                { id: 'user_1', nickname: '小动物爱好者', phone: '13800000001', city: '上海市', role: 'normal', petCount: 3, adoptCount: 1, rating: 4.8, createdAt: this.getRandomDate(180) },
                { id: 'user_2', nickname: '宠物医生', phone: '13800000002', city: '北京市', role: 'org', petCount: 8, adoptCount: 5, rating: 4.9, createdAt: this.getRandomDate(365) },
                { id: 'user_3', nickname: '爱宠人士', phone: '13800000003', city: '广州市', role: 'normal', petCount: 2, adoptCount: 0, rating: 4.5, createdAt: this.getRandomDate(90) },
                { id: 'user_4', nickname: '救助站小李', phone: '13800000004', city: '杭州市', role: 'org', petCount: 15, adoptCount: 12, rating: 5.0, createdAt: this.getRandomDate(400) },
                { id: 'user_5', nickname: '新手铲屎官', phone: '13800000005', city: '深圳市', role: 'normal', petCount: 1, adoptCount: 1, rating: 4.2, createdAt: this.getRandomDate(30) }
            ];

            demoUsers.forEach(user => {
                Store.createUser(user);
                // 设置默认密码
                localStorage.setItem(`pets_pwd_${user.phone}`, '123456');
            });
        }

        return Store.getUsers();
    },

    // 初始化演示数据
    initDemoData() {
        // 初始化用户
        this.initDemoUsers();

        // 检查是否已有宠物数据
        const existingPets = Store.getPets();
        if (existingPets.length === 0) {
            // 生成宠物数据
            const pets = this.generatePets(20);

            // 确保用户ID存在
            const users = Store.getUsers();

            pets.forEach(pet => {
                // 随机分配给现有用户
                const randomUser = users[Math.floor(Math.random() * users.length)];
                pet.ownerId = randomUser.id;
                Store.createPet(pet);
            });
        }

        // 添加一些通知
        const currentUser = Store.getCurrentUser();
        if (currentUser) {
            const notifications = Store.getNotifications(currentUser.id);
            if (notifications.length === 0) {
                Store.addNotification(currentUser.id, 'system', '欢迎来到毛毛家', '开始您的宠物领养之旅吧！');
                Store.addNotification(currentUser.id, 'adoption', '新宠物上线', '今天有新的宠物等待领养，快来看看吧！');
            }
        }
    },

    // 获取宠物类型信息
    getPetTypeInfo(type) {
        return this.petTypes.find(t => t.value === type) || this.petTypes[0];
    },

    // 获取城市列表
    getCities() {
        return this.cities;
    }
};

// 默认头像
const defaultAvatars = [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100'
];
