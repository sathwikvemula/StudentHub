package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SmartTaskResponse {

    private Long id;
    private String title;
    private String category;

    private LocalDateTime deadline;

    private boolean completed;

    private String priority;

    private String status;

    private int urgencyScore;
}
