package com.maomao.service;

import com.maomao.entity.Favorite;
import com.maomao.entity.FavoriteId;
import com.maomao.entity.Pet;
import com.maomao.repository.FavoriteRepository;
import com.maomao.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PetRepository petRepository;

    public List<Favorite> getUserFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    @Transactional
    public boolean toggleFavorite(String userId, String petId) {
        boolean exists = favoriteRepository.existsByUserIdAndPetId(userId, petId);

        if (exists) {
            favoriteRepository.deleteByUserIdAndPetId(userId, petId);

            // Decrease fav count
            Pet pet = petRepository.findById(petId).orElse(null);
            if (pet != null && pet.getFavCount() > 0) {
                pet.setFavCount(pet.getFavCount() - 1);
                petRepository.save(pet);
            }

            return false;
        } else {
            Favorite favorite = new Favorite();
            favorite.setUserId(userId);
            favorite.setPetId(petId);
            favoriteRepository.save(favorite);

            // Increase fav count
            Pet pet = petRepository.findById(petId).orElse(null);
            if (pet != null) {
                pet.setFavCount(pet.getFavCount() + 1);
                petRepository.save(pet);
            }

            return true;
        }
    }

    public boolean isFavorited(String userId, String petId) {
        return favoriteRepository.existsByUserIdAndPetId(userId, petId);
    }
}
