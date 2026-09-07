 package com.example.demo.security;

import com.example.demo.appuser.AppUserService;
import com.example.demo.security.jwt.JwtFilter;
import lombok.AllArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig {

    private final JwtFilter jwtFilter;
    private final AppUserService appUserService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;



    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http


                // Uses the CorsConfigurationSource from CorsConfig.java
                .cors(cors -> {})


                .csrf(csrf -> csrf.disable())


                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                .authenticationProvider(
                        daoAuthenticationProvider()
                )


                .authorizeHttpRequests(auth -> auth

                        // WebSocket
                        .requestMatchers("/ws/**")
                        .permitAll()


                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/auth/login",
                                "/api/v1/auth/register"
                        )
                        .permitAll()


                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/auth/confirm",
                                "/api/v1/auth/users"
                        )
                        .permitAll()


                        .anyRequest()
                        .authenticated()
                )


                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    @Bean
    public org.springframework.security.authentication.AuthenticationManager
    authenticationManager(
            org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }


    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        appUserService
                );

        provider.setPasswordEncoder(
                bCryptPasswordEncoder
        );

        return provider;
    }
}
