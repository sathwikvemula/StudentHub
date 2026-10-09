package com.example.demo.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {

    private final RestClient restClient;
    private final String apiKey;
    private final String senderEmail;
    private final String senderName;

    public BrevoEmailService(
            @Value("${BREVO_API_KEY}") String apiKey,
            @Value("${BREVO_SENDER_EMAIL}") String senderEmail,
            @Value("${BREVO_SENDER_NAME:StudentHub}") String senderName) {

        this.restClient = RestClient.create(
                "https://api.brevo.com/v3"
        );

        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
    }

    public void sendTextEmail(
            String recipient,
            String subject,
            String message) {

        send(recipient, subject, "textContent", message);
    }

    public void sendHtmlEmail(
            String recipient,
            String subject,
            String htmlContent) {

        send(recipient, subject, "htmlContent", htmlContent);
    }

    private void send(
            String recipient,
            String subject,
            String contentType,
            String content) {

        Map<String, Object> request = new LinkedHashMap<>();

        request.put("sender", Map.of(
                "name", senderName,
                "email", senderEmail
        ));

        request.put("to", List.of(
                Map.of("email", recipient)
        ));

        request.put("subject", subject);
        request.put(contentType, content);

        restClient.post()
                .uri("/smtp/email")
                .header("api-key", apiKey)
                .header("accept", "application/json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }
}