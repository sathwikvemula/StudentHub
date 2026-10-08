
        package com.example.demo.registration;

import com.example.demo.appuser.AppUserService;
import com.example.demo.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    private final AppUserService appUserService;

    @PostMapping("/register")
    public String register(@RequestBody RegistrationRequest request) {

        System.out.println("REGISTER API HIT: " + request.getEmail());

        return registrationService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        System.out.println("LOGIN API HIT: " + request.getEmail());

        String token = registrationService.login(request);

        return new LoginResponse(token);
    }

    @GetMapping("/confirm")
    public String confirm(@RequestParam("token") String token) {

        return registrationService.confirmToken(token);
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {

        return appUserService.getAllUsers();
    }

    @GetMapping("/me")
    public UserDto getCurrentUser() {

        return appUserService.getCurrentUserDto();
    }
}
