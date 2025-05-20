package com.flashreport.api.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.flashreport.api.model.User;
import com.flashreport.api.repository.UserRepository;
import com.flashreport.api.dto.UserResponse;
import com.flashreport.api.dto.UpdateUserRequest;
import com.flashreport.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.debug("Fetching current user with username: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found");
                });
        
        log.debug("Found current user: {} with role: {}", username, user.getRole());
        return UserResponse.fromUser(user);
    }

    public UserResponse getUser(Long id) {
        log.debug("Fetching user with id: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found");
                });
        
        log.debug("Found user: {} with role: {}", user.getUsername(), user.getRole());
        return UserResponse.fromUser(user);
    }

    @Transactional
    public UserResponse updateCurrentUser(UpdateUserRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.debug("Updating current user with username: {}", username);
        
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found");
                });

        updateUserFields(currentUser, request);
        User updatedUser = userRepository.save(currentUser);
        log.debug("Successfully updated user: {}", username);
        return UserResponse.fromUser(updatedUser);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.debug("Updating user with id: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        updateUserFields(user, request);
        User updatedUser = userRepository.save(user);
        log.debug("Successfully updated user: {} with id: {}", updatedUser.getUsername(), id);
        return UserResponse.fromUser(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        log.debug("Deleting user with id: {}", id);
        
        if (!userRepository.existsById(id)) {
            log.error("User not found with id: {}", id);
            throw new ResourceNotFoundException("User not found");
        }
        
        userRepository.deleteById(id);
        log.debug("Successfully deleted user with id: {}", id);
    }

    public List<UserResponse> getAllUsers() {
        log.debug("Fetching all users");
        
        List<User> users = userRepository.findAll();
        log.debug("Found {} users", users.size());
        
        return users.stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    private void updateUserFields(User user, UpdateUserRequest request) {
        log.debug("Updating fields for user: {}", user.getUsername());
        
        if (request.getFirstname() != null) {
            user.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null) {
            user.setLastname(request.getLastname());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        
        log.debug("Fields updated for user: {}", user.getUsername());
    }

    @Transactional
    public UserResponse promoteToAdmin(Long id) {
        log.debug("Promoting user with id: {} to admin role", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        user.setRole(User.Role.ADMIN);
        User updatedUser = userRepository.save(user);
        log.debug("Successfully promoted user: {} to admin role", updatedUser.getUsername());
        
        return UserResponse.fromUser(updatedUser);
    }

    @Transactional
    public UserResponse demoteFromAdmin(Long id) {
        log.debug("Demoting admin with id: {} to user role", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        // Prevent demoting the last admin
        if (user.getRole() == User.Role.ADMIN && countAdmins() <= 1) {
            log.error("Cannot demote the last admin user");
            throw new IllegalStateException("Cannot demote the last admin user");
        }

        user.setRole(User.Role.USER);
        User updatedUser = userRepository.save(user);
        log.debug("Successfully demoted user: {} to regular user role", updatedUser.getUsername());
        
        return UserResponse.fromUser(updatedUser);
    }

    public long countAdmins() {
        return userRepository.countByRole(User.Role.ADMIN);
    }

    public List<UserResponse> getUsersByRole(User.Role role) {
        log.debug("Fetching all users with role: {}", role);
        
        List<User> users = userRepository.findByRole(role);
        log.debug("Found {} users with role {}", users.size(), role);
        
        return users.stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }
} 