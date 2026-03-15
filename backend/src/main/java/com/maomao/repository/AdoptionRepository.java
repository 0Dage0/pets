package com.maomao.repository;

import com.maomao.entity.Adoption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdoptionRepository extends JpaRepository<Adoption, String> {

    List<Adoption> findByPetId(String petId);

    List<Adoption> findByApplicantId(String applicantId);

    List<Adoption> findByPetIdIn(List<String> petIds);
}
