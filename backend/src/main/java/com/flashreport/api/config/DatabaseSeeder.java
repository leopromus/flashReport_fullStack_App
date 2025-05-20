package com.flashreport.api.config;

import com.flashreport.api.model.User;
import com.flashreport.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
    }

    private void seedAdminUser() {
        // Check if admin user exists
        if (!userRepository.existsByUsername("admin")) {
            log.info("Creating admin user...");
            
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123")); // You should change this password
            adminUser.setFirstname("Admin");
            adminUser.setLastname("User");
            adminUser.setEmail("admin@flashreport.com");
            adminUser.setPhoneNumber("+250700000000");
            adminUser.setRole(User.Role.ADMIN);

            userRepository.save(adminUser);
            log.info("Admin user created successfully");
        } else {
            log.info("Admin user already exists");
        }
    }
} 