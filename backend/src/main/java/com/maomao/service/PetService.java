package com.maomao.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maomao.dto.PetRequest;
import com.maomao.entity.Pet;
import com.maomao.entity.User;
import com.maomao.repository.PetRepository;
import com.maomao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public Page<Pet> getPets(String type, String city, String status, String keyword, String sort, int page, int size) {
        Sort sortBy = Sort.by("createdAt").descending();
        if ("popular".equals(sort)) {
            sortBy = Sort.by("favCount").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sortBy);
        return petRepository.searchPets(type, city, status, keyword, pageable);
    }

    public Pet getPetById(String id) {
        return petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("宠物不存在"));
    }

    @Transactional
    public Pet createPet(PetRequest request, String ownerId) {
        Pet pet = new Pet();
        pet.setId(UUID.randomUUID().toString());
        pet.setName(request.getName());
        pet.setType(request.getType());
        pet.setBreed(request.getBreed());
        pet.setAge(request.getAge());
        pet.setAgeMonths(request.getAgeMonths());
        pet.setGender(request.getGender());
        pet.setCity(request.getCity());
        pet.setStatus("available");
        pet.setDescription(request.getDescription());
        pet.setOwnerId(ownerId);
        pet.setViewCount(0);
        pet.setFavCount(0);

        try {
            pet.setHealthTags(objectMapper.writeValueAsString(request.getHealthTags()));
            pet.setTraitTags(objectMapper.writeValueAsString(request.getTraitTags()));
            pet.setRequirements(objectMapper.writeValueAsString(request.getRequirements()));
            pet.setMedia(objectMapper.writeValueAsString(request.getMedia()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("数据序列化失败");
        }

        pet = petRepository.save(pet);

        // Update user pet count
        User owner = userRepository.findById(ownerId).orElse(null);
        if (owner != null) {
            owner.setPetCount(owner.getPetCount() + 1);
            userRepository.save(owner);
        }

        return pet;
    }

    @Transactional
    public Pet updatePet(String id, PetRequest request, String ownerId) {
        Pet pet = getPetById(id);

        if (!pet.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("无权限修改");
        }

        if (request.getName() != null) pet.setName(request.getName());
        if (request.getType() != null) pet.setType(request.getType());
        if (request.getBreed() != null) pet.setBreed(request.getBreed());
        if (request.getAge() != null) pet.setAge(request.getAge());
        if (request.getAgeMonths() != null) pet.setAgeMonths(request.getAgeMonths());
        if (request.getGender() != null) pet.setGender(request.getGender());
        if (request.getCity() != null) pet.setCity(request.getCity());
        if (request.getDescription() != null) pet.setDescription(request.getDescription());

        try {
            if (request.getHealthTags() != null) {
                pet.setHealthTags(objectMapper.writeValueAsString(request.getHealthTags()));
            }
            if (request.getTraitTags() != null) {
                pet.setTraitTags(objectMapper.writeValueAsString(request.getTraitTags()));
            }
            if (request.getRequirements() != null) {
                pet.setRequirements(objectMapper.writeValueAsString(request.getRequirements()));
            }
            if (request.getMedia() != null) {
                pet.setMedia(objectMapper.writeValueAsString(request.getMedia()));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("数据序列化失败");
        }

        return petRepository.save(pet);
    }

    @Transactional
    public void deletePet(String id, String ownerId) {
        Pet pet = getPetById(id);

        if (!pet.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("无权限删除");
        }

        petRepository.delete(pet);

        // Update user pet count
        User owner = userRepository.findById(ownerId).orElse(null);
        if (owner != null) {
            owner.setPetCount(Math.max(0, owner.getPetCount() - 1));
            userRepository.save(owner);
        }
    }

    @Transactional
    public void incrementViewCount(String id) {
        Pet pet = getPetById(id);
        pet.setViewCount(pet.getViewCount() + 1);
        petRepository.save(pet);
    }

    public List<Pet> getPetsByOwner(String ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public List<String> parseJsonList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}
