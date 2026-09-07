package com.example.demo.notes;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserService;
import com.example.demo.dto.DashboardStatsResponse;
import com.example.demo.dto.NoteRequest;
import com.example.demo.dto.NoteResponse;
import com.example.demo.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.demo.dto.SmartTaskResponse;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final AppUserService appUserService;
    private final SimpMessagingTemplate messagingTemplate;

    private AppUser getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated");
        }

        return appUserService.getUserByEmail(auth.getName());
    }

    public NoteResponse createNote(NoteRequest request) {

        AppUser user = getCurrentUser();

        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setCategory(request.getCategory());

        note.setDeadline(request.getDeadline());

        note.setPriority(request.getPriority());
        note.setCompleted(false);
        note.setUser(user);

        Note saved = noteRepository.save(note);

        messagingTemplate.convertAndSend("/topic/notes/" + user.getEmail(), "UPDATED");

        return map(saved);
    }

    public List<NoteResponse> getAllNotes() {
        AppUser user = getCurrentUser();
        return noteRepository.findByUser(user).stream().map(this::map).toList();
    }

    public List<NoteResponse> search(String keyword) {
        AppUser user = getCurrentUser();

        return noteRepository
                .searchNotes(user, keyword)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<NoteResponse> filterByPriority(String priority) {
        AppUser user = getCurrentUser();
        return noteRepository.findByUserAndPriority(user, priority)
                .stream().map(this::map).toList();
    }

    public List<NoteResponse> filterByCompleted(boolean completed) {
        AppUser user = getCurrentUser();
        return noteRepository.findByUserAndCompleted(user, completed)
                .stream().map(this::map).toList();
    }

    public NoteResponse updateNote(Long id, NoteRequest request) {

        AppUser user = getCurrentUser();

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Check whether deadline changed
        boolean deadlineChanged =
                (note.getDeadline() == null && request.getDeadline() != null)
                        || (note.getDeadline() != null && request.getDeadline() == null)
                        || (note.getDeadline() != null
                        && request.getDeadline() != null
                        && !note.getDeadline().equals(request.getDeadline()));

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setCategory(request.getCategory());
        note.setDeadline(request.getDeadline());
        note.setPriority(request.getPriority());
        note.setCompleted(request.getCompleted());

        // If deadline changed, allow a new reminder
        if (deadlineChanged) {
            note.setReminderSent(false);
        }

        Note updated = noteRepository.save(note);

        // Notify frontend that notes changed
        messagingTemplate.convertAndSend(
                "/topic/notes/" + user.getEmail(),
                "UPDATED"
        );

        return map(updated);
    }

    public String deleteNote(Long id) {

        AppUser user = getCurrentUser();

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        noteRepository.delete(note);

        messagingTemplate.convertAndSend("/topic/notes/" + user.getEmail(), "UPDATED");

        return "Deleted";
    }

    public Page<NoteResponse> getNotesPaginated(int page, int size) {

        AppUser user = getCurrentUser();

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return noteRepository.findByUser(user, pageable)
                .map(this::map);
    }

    private NoteResponse map(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCategory(),
                note.getDeadline(),
                note.isCompleted(),
                note.getPriority(),
                new UserDto(
                        note.getUser().getFirstName(),
                        note.getUser().getLastName(),
                        note.getUser().getEmail()
                )
        );
    }
    public DashboardStatsResponse getDashboardStats() {

        AppUser user = getCurrentUser();

        var categoryData = noteRepository.countNotesByCategory(user);

        Map<String, Long> categoryMap = new HashMap<>();

        for (Object[] row : categoryData) {
            String category = (String) row[0];
            Long count = (Long) row[1];
            categoryMap.put(category, count);
        }

        long completed = noteRepository.countCompleted(user);
        long pending = noteRepository.countPending(user);

        return new DashboardStatsResponse(categoryMap, completed, pending);
    }


    public List<SmartTaskResponse> getSmartTasks() {

        AppUser user = getCurrentUser();

        List<Note> notes = noteRepository.findByUser(user);

        return notes.stream()
                .filter(note -> !note.isCompleted())
                .map(this::calculateSmartTask)
                .sorted((a, b) ->
                        Integer.compare(
                                b.getUrgencyScore(),
                                a.getUrgencyScore()
                        )
                )
                .toList();
    }
    private SmartTaskResponse calculateSmartTask(Note note) {

        LocalDateTime now = LocalDateTime.now();

        String status;
        int score;


        if (note.isCompleted()) {

            status = "COMPLETED";
            score = 0;

        }

        else if (note.getDeadline() == null) {

            status = "NO_DEADLINE";
            score = 20;

        }

        else {

            long minutesRemaining =
                    java.time.Duration
                            .between(now, note.getDeadline())
                            .toMinutes();

            if (minutesRemaining < 0) {

                status = "OVERDUE";
                score = 100;

            }


            else if (minutesRemaining <= 60) {

                status = "DUE_SOON";
                score = 95;

            }

            // ================================================
            // 🟡 DUE WITHIN 6 HOURS
            // ================================================

            else if (minutesRemaining <= 360) {

                status = "DUE_SOON";
                score = 85;

            }

            else if (minutesRemaining <= 1440) {

                status = "DUE_SOON";
                score = 75;

            }


            else if (minutesRemaining <= 4320) {

                status = "UPCOMING";
                score = 50;

            }


            else {

                status = "NORMAL";
                score = 30;
            }
        }


        if (!note.isCompleted()) {

            if ("HIGH".equalsIgnoreCase(note.getPriority())) {
                score += 20;

            } else if ("MEDIUM".equalsIgnoreCase(note.getPriority())) {
                score += 10;
            }
        }

        return new SmartTaskResponse(
                note.getId(),
                note.getTitle(),
                note.getCategory(),
                note.getDeadline(),
                note.isCompleted(),
                note.getPriority(),
                status,
                score
        );
    }

}