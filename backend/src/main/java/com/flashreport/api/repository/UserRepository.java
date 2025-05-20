package com.flashreport.api.repository;

import com.flashreport.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "SELECT * FROM users WHERE email = :email LIMIT 1", nativeQuery = true)
    Optional<User> findByEmail(@Param("email") String email);
    
    @Query(value = "SELECT * FROM users WHERE username = :username LIMIT 1", nativeQuery = true)
    Optional<User> findByUsername(@Param("username") String username);
    
    @Query(value = "SELECT COUNT(*) FROM users WHERE email = :email", nativeQuery = true)
    Integer existsByEmailQuery(@Param("email") String email);
    
    @Query(value = "SELECT COUNT(*) FROM users WHERE username = :username", nativeQuery = true)
    Integer existsByUsernameQuery(@Param("username") String username);

    default boolean existsByEmail(String email) {
        return existsByEmailQuery(email) > 0;
    }

    default boolean existsByUsername(String username) {
        return existsByUsernameQuery(username) > 0;
    }

    List<User> findByRole(User.Role role);
    long countByRole(User.Role role);
} 