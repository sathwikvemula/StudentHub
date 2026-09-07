package com.example.demo.notes;

import com.example.demo.appuser.AppUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;

    private String category;

    private LocalDateTime deadline;
    private boolean completed = false;
    private String priority = "LOW";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
    @Column(nullable = false)
    private boolean reminderSent = false;
}