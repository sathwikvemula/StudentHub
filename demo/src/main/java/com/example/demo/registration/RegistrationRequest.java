package com.example.demo.registration;


import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
@ToString
public class RegistrationRequest {
    private   String firstName;
    private   String lastName;
    private   String email;
    private  String password;
}
