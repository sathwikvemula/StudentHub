package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@ResponseStatus(HttpStatus.CREATED)
public class NoteResponse {

    private Long id;
    private String title;
    private String content;
    private String category;
    private LocalDateTime deadline;
    private boolean completed;
    private String priority;
    private UserDto user;
}