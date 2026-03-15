package com.maomao.entity;

import java.io.Serializable;
import java.util.Objects;

public class FavoriteId implements Serializable {

    private String userId;
    private String petId;

    public FavoriteId() {}

    public FavoriteId(String userId, String petId) {
        this.userId = userId;
        this.petId = petId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FavoriteId favoriteId = (FavoriteId) o;
        return Objects.equals(userId, favoriteId.userId) && Objects.equals(petId, favoriteId.petId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, petId);
    }
}
