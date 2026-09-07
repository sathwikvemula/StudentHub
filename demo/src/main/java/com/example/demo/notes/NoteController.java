package com.example.demo.notes;

import com.example.demo.dto.NoteRequest;
import com.example.demo.dto.NoteResponse;
import com.example.demo.dto.DashboardStatsResponse;
import com.example.demo.dto.SmartTaskResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
@AllArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public NoteResponse create(@RequestBody NoteRequest request) {
        return noteService.createNote(request);
    }

    @PutMapping("/{id}")
    public NoteResponse update(@PathVariable Long id,
                               @RequestBody NoteRequest request) {
        return noteService.updateNote(id, request);
    }

    @GetMapping("/my")
    public List<NoteResponse> getMyNotes() {
        return noteService.getAllNotes();
    }


    @GetMapping("/search")
    public List<NoteResponse> search(@RequestParam String keyword) {
        return noteService.search(keyword);
    }


    @GetMapping("/priority")
    public List<NoteResponse> priority(@RequestParam String value) {
        return noteService.filterByPriority(value);
    }

    @GetMapping("/completed")
    public List<NoteResponse> completed(@RequestParam boolean value) {
        return noteService.filterByCompleted(value);
    }

    @GetMapping("/dashboard")
    public DashboardStatsResponse dashboard() {
        return noteService.getDashboardStats();
    }

    @GetMapping("/smart")
    public List<SmartTaskResponse> getSmartTasks() {
        return noteService.getSmartTasks();
    }
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        return noteService.deleteNote(id);
    }

}