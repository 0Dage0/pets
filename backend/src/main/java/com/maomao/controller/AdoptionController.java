package com.maomao.controller;

import com.maomao.dto.AdoptionRequest;
import com.maomao.entity.Adoption;
import com.maomao.service.AdoptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionController {

    private final AdoptionService adoptionService;

    @PostMapping
    public ResponseEntity<Adoption> createAdoption(@RequestBody AdoptionRequest request, Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            Adoption adoption = adoptionService.createAdoption(request, userId);
            return ResponseEntity.ok(adoption);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Adoption>> getAdoptions(Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        List<Adoption> adoptions = adoptionService.getUserAdoptions(userId);
        return ResponseEntity.ok(adoptions);
    }

    @GetMapping("/received")
    public ResponseEntity<List<Adoption>> getReceivedAdoptions(Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        List<Adoption> adoptions = adoptionService.getReceivedAdoptions(userId);
        return ResponseEntity.ok(adoptions);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Adoption> updateStatus(@PathVariable String id, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            String status = request.get("status");
            Adoption adoption = adoptionService.updateAdoptionStatus(id, status, userId);
            return ResponseEntity.ok(adoption);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
