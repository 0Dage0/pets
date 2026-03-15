package com.maomao.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maomao.dto.AdoptionRequest;
import com.maomao.entity.Adoption;
import com.maomao.entity.Notification;
import com.maomao.entity.Pet;
import com.maomao.entity.User;
import com.maomao.repository.AdoptionRepository;
import com.maomao.repository.NotificationRepository;
import com.maomao.repository.PetRepository;
import com.maomao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdoptionService {

    private final AdoptionRepository adoptionRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ObjectMapper objectMapper;

    public Adoption createAdoption(AdoptionRequest request, String applicantId) {
        Pet pet = petRepository.findById(request.getPetId())
            .orElseThrow(() -> new RuntimeException("宠物不存在"));

        if (!"available".equals(pet.getStatus())) {
            throw new RuntimeException("该宠物不可申请领养");
        }

        Adoption adoption = new Adoption();
        adoption.setId(UUID.randomUUID().toString());
        adoption.setPetId(request.getPetId());
        adoption.setApplicantId(applicantId);
        adoption.setStatus("pending");
        adoption.setRealName(request.getRealName());
        adoption.setPhone(request.getPhone());
        adoption.setAge(request.getAge());
        adoption.setProfession(request.getProfession());
        adoption.setLivingType(request.getLivingType());
        adoption.setDailyHours(request.getDailyHours());
        adoption.setPetExperience(request.getPetExperience());
        adoption.setMotivation(request.getMotivation());

        try {
            if (request.getFamilyInfo() != null) {
                adoption.setFamilyInfo(objectMapper.writeValueAsString(request.getFamilyInfo()));
            }
            if (request.getCommitments() != null) {
                adoption.setCommitments(objectMapper.writeValueAsString(request.getCommitments()));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("数据序列化失败");
        }

        adoption = adoptionRepository.save(adoption);

        // Update pet status
        pet.setStatus("applying");
        petRepository.save(pet);

        // Send notification to pet owner
        User owner = userRepository.findById(pet.getOwnerId()).orElse(null);
        if (owner != null) {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setUserId(owner.getId());
            notification.setType("adoption");
            notification.setTitle("新的领养申请");
            notification.setContent("您发布的宠物收到了新的领养申请");
            notificationRepository.save(notification);
        }

        return adoption;
    }

    public List<Adoption> getUserAdoptions(String userId) {
        return adoptionRepository.findByApplicantId(userId);
    }

    public List<Adoption> getReceivedAdoptions(String userId) {
        List<Pet> pets = petRepository.findByOwnerId(userId);
        List<String> petIds = pets.stream().map(Pet::getId).toList();
        return adoptionRepository.findByPetIdIn(petIds);
    }

    @Transactional
    public Adoption updateAdoptionStatus(String id, String status, String userId) {
        Adoption adoption = adoptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("申请不存在"));

        Pet pet = petRepository.findById(adoption.getPetId())
            .orElseThrow(() -> new RuntimeException("宠物不存在"));

        // Only pet owner can update status
        if (!pet.getOwnerId().equals(userId)) {
            throw new RuntimeException("无权限操作");
        }

        adoption.setStatus(status);
        adoption = adoptionRepository.save(adoption);

        // Update pet status based on adoption status
        if ("accepted".equals(status)) {
            pet.setStatus("handover");
            petRepository.save(pet);

            // Notify applicant
            User applicant = userRepository.findById(adoption.getApplicantId()).orElse(null);
            if (applicant != null) {
                Notification notification = new Notification();
                notification.setId(UUID.randomUUID().toString());
                notification.setUserId(applicant.getId());
                notification.setType("adoption");
                notification.setTitle("领养申请通过");
                notification.setContent("您的领养申请已通过，请联系送养人");
                notificationRepository.save(notification);
            }
        } else if ("rejected".equals(status)) {
            pet.setStatus("available");
            petRepository.save(pet);

            // Notify applicant
            User applicant = userRepository.findById(adoption.getApplicantId()).orElse(null);
            if (applicant != null) {
                Notification notification = new Notification();
                notification.setId(UUID.randomUUID().toString());
                notification.setUserId(applicant.getId());
                notification.setType("adoption");
                notification.setTitle("领养申请被拒绝");
                notification.setContent("很抱歉，您的领养申请被拒绝");
                notificationRepository.save(notification);
            }
        } else if ("completed".equals(status)) {
            pet.setStatus("adopted");
            petRepository.save(pet);

            // Update adopt counts
            User applicant = userRepository.findById(adoption.getApplicantId()).orElse(null);
            if (applicant != null) {
                applicant.setAdoptCount(applicant.getAdoptCount() + 1);
                userRepository.save(applicant);
            }

            User owner = userRepository.findById(pet.getOwnerId()).orElse(null);
            if (owner != null) {
                owner.setAdoptCount(owner.getAdoptCount() + 1);
                userRepository.save(owner);
            }
        }

        return adoption;
    }

    public List<String> parseJsonList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}
