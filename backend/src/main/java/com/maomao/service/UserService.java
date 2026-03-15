package com.maomao.service;

import com.maomao.dto.AuthResponse;
import com.maomao.dto.LoginRequest;
import com.maomao.dto.RegisterRequest;
import com.maomao.entity.User;
import com.maomao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
            .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token, user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("该手机号已注册");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setNickname(request.getNickname());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCity(request.getCity());
        user.setRole("normal");
        user.setPetCount(0);
        user.setAdoptCount(0);
        user.setRating(5.0);

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token, user);
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User updateUser(String id, User userData) {
        User user = getUserById(id);

        if (userData.getNickname() != null) {
            user.setNickname(userData.getNickname());
        }
        if (userData.getAvatar() != null) {
            user.setAvatar(userData.getAvatar());
        }
        if (userData.getCity() != null) {
            user.setCity(userData.getCity());
        }

        return userRepository.save(user);
    }

    public User getUserByPhone(String phone) {
        return userRepository.findByPhone(phone).orElse(null);
    }
}
