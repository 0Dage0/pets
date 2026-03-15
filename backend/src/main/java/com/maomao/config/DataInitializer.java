package com.maomao.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maomao.entity.Pet;
import com.maomao.entity.User;
import com.maomao.repository.PetRepository;
import com.maomao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            initDemoUsers();
            initDemoPets();
        }
    }

    private void initDemoUsers() {
        String[] names = {"小动物爱好者", "宠物医生", "爱宠人士", "救助站小李", "新手铲屎官"};
        String[] cities = {"上海市", "北京市", "广州市", "杭州市", "深圳市"};
        String[] roles = {"normal", "org", "normal", "org", "normal"};

        for (int i = 0; i < 5; i++) {
            User user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setNickname(names[i]);
            user.setPhone("1380000000" + (i + 1));
            user.setPassword(passwordEncoder.encode("123456"));
            user.setCity(cities[i]);
            user.setRole(roles[i]);
            user.setPetCount(0);
            user.setAdoptCount(0);
            user.setRating(4.5 + Math.random() * 0.5);
            userRepository.save(user);
        }
    }

    private void initDemoPets() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) return;

        String[] types = {"dog", "cat", "rabbit", "hamster", "bird"};
        String[] typeNames = {"狗狗", "猫咪", "兔子", "仓鼠", "鸟类"};
        String[] dogBreeds = {"中华田园犬", "金毛", "泰迪", "柯基", "哈士奇"};
        String[] catBreeds = {"中华田园猫", "英短", "美短", "暹罗", "布偶"};
        String[] rabbitBreeds = {"垂耳兔", "侏儒兔", "安哥拉兔"};
        String[] hamsterBreeds = {"仓鼠", "金丝熊", "公婆鼠"};
        String[] birdBreeds = {"鹦鹉", "文鸟", "玄凤"};

        String[] names = {"豆豆", "旺财", "小米", "布丁", "可乐", "团子", "咪咪", "小橘", "糖糖", "毛球",
                         "雪球", "小白", "灰灰", "花花", "小虎", "大黄", "Lucky", "哈皮", "笨笨", "小黑"};

        String[] cities = {"北京市", "上海市", "广州市", "深圳市", "杭州市", "南京市", "成都市", "重庆市"};

        String[] healthTags = {"已接种疫苗", "已绝育", "已驱虫", "已体检"};
        String[] traitTags = {"温顺", "亲人", "活泼", "粘人", "聪明", "忠诚", "独立", "好动", "安静"};

        Random random = new Random();

        for (int i = 0; i < 20; i++) {
            User owner = users.get(random.nextInt(users.size()));

            int typeIndex = random.nextInt(types.length);
            String type = types[typeIndex];

            Pet pet = new Pet();
            pet.setId(UUID.randomUUID().toString());
            pet.setName(names[i]);
            pet.setType(type);
            pet.setAgeMonths(random.nextInt(60) + 1);
            pet.setAge(pet.getAgeMonths() < 12 ? pet.getAgeMonths() + "个月" : (pet.getAgeMonths() / 12) + "岁");
            pet.setGender(random.nextBoolean() ? "male" : "female");
            pet.setCity(cities[random.nextInt(cities.length)]);
            pet.setStatus(random.nextInt(5) == 0 ? "adopted" : "available");
            pet.setDescription("一只非常可爱的" + typeNames[typeIndex] + "，性格温顺亲人。");
            pet.setOwnerId(owner.getId());
            pet.setViewCount(random.nextInt(500));
            pet.setFavCount(random.nextInt(50));

            // Random breed based on type
            String[] breeds;
            switch (type) {
                case "dog": breeds = dogBreeds; break;
                case "cat": breeds = catBreeds; break;
                case "rabbit": breeds = rabbitBreeds; break;
                case "hamster": breeds = hamsterBreeds; break;
                default: breeds = birdBreeds;
            }
            pet.setBreed(breeds[random.nextInt(breeds.length)]);

            // Random tags
            List<String> selectedHealth = new ArrayList<>();
            List<String> selectedTrait = new ArrayList<>();
            int healthCount = random.nextInt(3) + 1;
            int traitCount = random.nextInt(3) + 1;

            for (int j = 0; j < healthCount; j++) {
                String tag = healthTags[random.nextInt(healthTags.length)];
                if (!selectedHealth.contains(tag)) selectedHealth.add(tag);
            }
            for (int j = 0; j < traitCount; j++) {
                String tag = traitTags[random.nextInt(traitTags.length)];
                if (!selectedTrait.contains(tag)) selectedTrait.add(tag);
            }

            try {
                pet.setHealthTags(objectMapper.writeValueAsString(selectedHealth));
                pet.setTraitTags(objectMapper.writeValueAsString(selectedTrait));
                pet.setRequirements(objectMapper.writeValueAsString(Arrays.asList("有固定住所", "经济稳定", "家人同意")));
            } catch (Exception e) {
                // Ignore
            }

            petRepository.save(pet);
        }
    }
}
