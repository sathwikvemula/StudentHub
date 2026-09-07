
package com.example.demo;

import com.example.demo.notes.Note;
import com.example.demo.notes.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final NoteRepository noteRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @Scheduled(fixedRate = 60000)
    public void checkDeadlines() {

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime nextWindow =
                now.plusMinutes(5);

        System.out.println("\n⏰ Checking deadlines...");
        System.out.println(
                "Time range: "
                        + now
                        + " -> "
                        + nextWindow
        );

        List<Note> notes =
                noteRepository.findUpcomingNotesWithUser(
                        now,
                        nextWindow
                );

        System.out.println(
                "Notes found: "
                        + notes.size()
        );

        for (Note note : notes) {

            try {

                String email =
                        note.getUser().getEmail();

                String message =
                        "⏰ Reminder: \""
                                + note.getTitle()
                                + "\" is due soon!";

                messagingTemplate.convertAndSendToUser(
                        email,
                        "/queue/notifications",
                        message
                );

                note.setReminderSent(true);

                noteRepository.save(note);

                System.out.println(
                        "✅ Reminder sent to: "
                                + email
                );

            } catch (Exception e) {

                System.err.println(
                        "❌ Failed to send reminder for note "
                                + note.getId()
                );

                e.printStackTrace();
            }
        }
    }
}
