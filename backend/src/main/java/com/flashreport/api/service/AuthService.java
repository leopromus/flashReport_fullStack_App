package com.flashreport.api.service;

import com.flashreport.api.dto.AuthResponse;
import com.flashreport.api.dto.LoginRequest;
import com.flashreport.api.dto.RegisterRequest;
import com.flashreport.api.exception.ResourceAlreadyExistsException;
import com.flashreport.api.exception.ResourceNotFoundException;
import com.flashreport.api.model.User;
import com.flashreport.api.repository.UserRepository;
import com.flashreport.api.security.JwtUtils;
import com.flashreport.api.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.debug("Starting registration process for username: {}", request.getUsername());
        
        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Registration failed: Username {} is already taken", request.getUsername());
            throw new ResourceAlreadyExistsException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email {} is already in use", request.getEmail());
            throw new ResourceAlreadyExistsException("Email is already in use");
        }

        // Store the raw password for authentication
        String rawPassword = request.getPassword();

        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(rawPassword));
        
        // Always set role to USER for new registrations
        user.setRole(User.Role.USER);
        log.debug("Setting user role to: {}", user.getRole());

        User savedUser = userRepository.save(user);
        log.debug("User saved successfully with ID: {} and role: {}", savedUser.getId(), savedUser.getRole());

        try {
            // Use the raw password for initial authentication
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), rawPassword)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            log.debug("Authentication successful and JWT token generated for user: {} with role: {}", 
                request.getUsername(), savedUser.getRole());

            return AuthResponse.fromUser(savedUser, jwt);
        } catch (Exception e) {
            log.error("Authentication failed after registration for user: {}", request.getUsername(), e);
            throw e;
        }
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        log.debug("User logged in successfully: {} with role: {}", user.getUsername(), user.getRole());

        return AuthResponse.fromUser(user, jwt);
    }
} 