package com.flashreport.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.flashreport.api.model.User;
import com.flashreport.api.service.UserService;
import com.flashreport.api.dto.UserResponse;
import com.flashreport.api.dto.UpdateUserRequest;
import com.flashreport.api.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // Admin endpoints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<java.util.List<UserResponse>>> getAllUsers() {
        log.debug("Fetching all users");
        try {
            java.util.List<UserResponse> users = userService.getAllUsers();
            log.debug("Successfully fetched {} users", users.size());
            return ResponseEntity.ok(new ApiResponse<>(200, "Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error fetching users: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        log.debug("Fetching user with id: {}", id);
        try {
            UserResponse user = userService.getUser(id);
            log.debug("Successfully fetched user: {}", user.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(200, "User retrieved successfully", user));
        } catch (Exception e) {
            log.error("Error fetching user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error fetching user: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        log.debug("Deleting user with id: {}", id);
        try {
            userService.deleteUser(id);
            log.debug("Successfully deleted user with id: {}", id);
            return ResponseEntity.ok(new ApiResponse<>(200, "User deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error deleting user: " + e.getMessage(), null));
        }
    }

    // User profile endpoints
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        log.debug("Fetching current user profile");
        try {
            UserResponse user = userService.getCurrentUser();
            log.debug("Successfully fetched profile for user: {}", user.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(200, "User profile retrieved successfully", user));
        } catch (Exception e) {
            log.error("Error fetching current user profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error fetching profile: " + e.getMessage(), null));
        }
    }

    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @Valid @RequestBody UpdateUserRequest request) {
        log.debug("Updating current user profile");
        try {
            UserResponse updatedUser = userService.updateCurrentUser(request);
            log.debug("Successfully updated profile for user: {}", updatedUser.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(200, "Profile updated successfully", updatedUser));
        } catch (Exception e) {
            log.error("Error updating current user profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error updating profile: " + e.getMessage(), null));
        }
    }

    // Admin user management endpoint
    @PatchMapping("/{id}/manage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> manageUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        log.debug("Admin updating user with id: {}", id);
        try {
            UserResponse updatedUser = userService.updateUser(id, request);
            log.debug("Successfully updated user: {}", updatedUser.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(200, "User updated successfully", updatedUser));
        } catch (Exception e) {
            log.error("Error updating user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error updating user: " + e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> promoteToAdmin(@PathVariable Long id) {
        log.debug("Promoting user with id: {} to admin role", id);
        try {
            UserResponse updatedUser = userService.promoteToAdmin(id);
            log.debug("Successfully promoted user: {} to admin role", updatedUser.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(200, "User promoted to admin successfully", updatedUser));
        } catch (Exception e) {
            log.error("Error promoting user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error promoting user: " + e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}/demote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> demoteFromAdmin(@PathVariable Long id) {
        log.debug("Demoting user with id: {} from admin role", id);
        try {
            UserResponse updatedUser = userService.demoteFromAdmin(id);
            log.debug("Successfully demoted user: {} from admin role", updatedUser.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(200, "User demoted from admin successfully", updatedUser));
        } catch (IllegalStateException e) {
            log.error("Cannot demote last admin user {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(400, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error demoting user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error demoting user: " + e.getMessage(), null));
        }
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(
            @PathVariable User.Role role) {
        log.debug("Fetching users with role: {}", role);
        try {
            List<UserResponse> users = userService.getUsersByRole(role);
            log.debug("Successfully fetched {} users with role {}", users.size(), role);
            return ResponseEntity.ok(new ApiResponse<>(200, "Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Error fetching users with role {}: {}", role, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error fetching users: " + e.getMessage(), null));
        }
    }

    @GetMapping("/admins/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getAdminCount() {
        log.debug("Counting admin users");
        try {
            long count = userService.countAdmins();
            log.debug("Found {} admin users", count);
            return ResponseEntity.ok(new ApiResponse<>(200, "Admin count retrieved successfully", count));
        } catch (Exception e) {
            log.error("Error counting admin users: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(500, "Error counting admins: " + e.getMessage(), null));
        }
    }
} 