package com.example.demo.notes;

import com.example.demo.appuser.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUser(AppUser user);

    Page<Note> findByUser(AppUser user, Pageable pageable);


    @Query("""
        SELECT n FROM Note n 
        WHERE n.user = :user AND 
        (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    List<Note> searchNotes(@Param("user") AppUser user,
                           @Param("keyword") String keyword);

    // FILTERS
    List<Note> findByUserAndPriority(AppUser user, String priority);
    List<Note> findByUserAndCompleted(AppUser user, boolean completed);


    @Query("SELECT n.category, COUNT(n) FROM Note n WHERE n.user = :user GROUP BY n.category")
    List<Object[]> countNotesByCategory(@Param("user") AppUser user);

    @Query("SELECT COUNT(n) FROM Note n WHERE n.user = :user AND n.completed = true")
    long countCompleted(@Param("user") AppUser user);

    @Query("SELECT COUNT(n) FROM Note n WHERE n.user = :user AND n.completed = false")
    long countPending(@Param("user") AppUser user);

    @Query("""
        SELECT n FROM Note n
        JOIN FETCH n.user
        WHERE n.deadline BETWEEN :start AND :end
        AND n.reminderSent = false
    """)
    List<Note> findUpcomingNotesWithUser(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}