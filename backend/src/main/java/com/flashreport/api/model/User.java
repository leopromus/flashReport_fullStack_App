package com.flashreport.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "username")
    })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 50)
    private String firstname;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 50)
    private String lastname;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 15)
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Size(max = 20)
    private String username;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 120)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    public enum Role {
        USER,
        ADMIN
    }
} 