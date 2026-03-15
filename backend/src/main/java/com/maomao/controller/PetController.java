package com.maomao.controller;

import com.maomao.dto.PetRequest;
import com.maomao.entity.Pet;
import com.maomao.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping
    public ResponseEntity<Page<Pet>> getPets(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Pet> pets = petService.getPets(type, city, status, keyword, sort, page, size);
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPet(@PathVariable String id) {
        try {
            Pet pet = petService.getPetById(id);
            return ResponseEntity.ok(pet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Pet> createPet(@RequestBody PetRequest request, Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            Pet pet = petService.createPet(request, userId);
            return ResponseEntity.ok(pet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable String id, @RequestBody PetRequest request, Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            Pet pet = petService.updatePet(id, request, userId);
            return ResponseEntity.ok(pet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable String id, Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            petService.deletePet(id, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementView(@PathVariable String id) {
        try {
            petService.incrementViewCount(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Pet>> getUserPets(@PathVariable String userId) {
        List<Pet> pets = petService.getPetsByOwner(userId);
        return ResponseEntity.ok(pets);
    }
}
