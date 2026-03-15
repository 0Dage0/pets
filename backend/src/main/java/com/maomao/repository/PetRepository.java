package com.maomao.repository;

import com.maomao.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, String> {

    List<Pet> findByOwnerId(String ownerId);

    Page<Pet> findByStatus(String status, Pageable pageable);

    @Query("SELECT p FROM Pet p WHERE " +
           "(:type IS NULL OR p.type = :type) AND " +
           "(:city IS NULL OR p.city = :city) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:keyword IS NULL OR p.name LIKE %:keyword% OR p.breed LIKE %:keyword% OR p.city LIKE %:keyword%)")
    Page<Pet> searchPets(
        @Param("type") String type,
        @Param("city") String city,
        @Param("status") String status,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    @Query("SELECT p FROM Pet p WHERE p.status IN ('available', 'applying', 'handover', 'adopted') ORDER BY p.createdAt DESC")
    List<Pet> findAllAvailable(Pageable pageable);
}
