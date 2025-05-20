package com.flashreport.api.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import com.flashreport.api.model.User;

@Component("userSecurity")
public class UserSecurity {
    
    public boolean isUserOrAdmin(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getId().equals(userId) || 
               currentUser.getRole().name().equals("ADMIN");
    }
} 