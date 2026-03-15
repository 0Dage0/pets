package com.maomao.controller;

import com.maomao.entity.Favorite;
import com.maomao.entity.Pet;
import com.maomao.repository.PetRepository;
import com.maomao.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final PetRepository petRepository;

    @GetMapping
    public ResponseEntity<List<Pet>> getFavorites(Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        List<Favorite> favorites = favoriteService.getUserFavorites(userId);

        List<Pet> pets = favorites.stream()
            .map(f -> petRepository.findById(f.getPetId()).orElse(null))
            .filter(p -> p != null)
            .toList();

        return ResponseEntity.ok(pets);
    }

    @PostMapping
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(@RequestBody Map<String, String> request, Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        String petId = request.get("petId");

        boolean isFavorited = favoriteService.toggleFavorite(userId, petId);
        return ResponseEntity.ok(Map.of("favorited", isFavorited));
    }

    @GetMapping("/check/{petId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable String petId, Authentication authentication) {
        String userId = authentication.getPrincipal().toString();
        boolean isFavorited = favoriteService.isFavorited(userId, petId);
        return ResponseEntity.ok(Map.of("favorited", isFavorited));
    }
}
