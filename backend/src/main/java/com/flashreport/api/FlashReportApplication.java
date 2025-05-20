package com.flashreport.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class FlashReportApplication {
    public static void main(String[] args) {
        SpringApplication.run(FlashReportApplication.class, args);
    }
} 