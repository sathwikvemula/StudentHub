package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class NoteRequest {
    private String title;
    private String content;
    private String category;

    private LocalDateTime deadline;
    private Boolean completed;
    private String priority;
}
