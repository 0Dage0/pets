package com.maomao.repository;

import com.maomao.entity.Favorite;
import com.maomao.entity.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {

    boolean existsByUserIdAndPetId(String userId, String petId);

    void deleteByUserIdAndPetId(String userId, String petId);

    @Query("SELECT f FROM Favorite f WHERE f.userId = :userId")
    List<Favorite> findByUserId(@Param("userId") String userId);
}
