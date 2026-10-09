package com.example.demo.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class EmailService implements EmailSender {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(EmailService.class);

    private final RestClient restClient;
    private final String apiKey;
    private final String senderEmail;
    private final String senderName;

    public EmailService(
            @Value("${BREVO_API_KEY}") String apiKey,
            @Value("${BREVO_SENDER_EMAIL}") String senderEmail,
            @Value("${BREVO_SENDER_NAME:StudentHub}") String senderName) {

        this.restClient = RestClient.create("https://api.brevo.com/v3");
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
    }

    @Override
    public void send(String to, String email) {
        Map<String, Object> request = Map.of(
                "sender", Map.of(
                        "name", senderName,
                        "email", senderEmail
                ),
                "to", List.of(Map.of("email", to)),
                "subject", "Confirm your email",
                "htmlContent", email
        );

        try {
            restClient.post()
                    .uri("/smtp/email")
                    .header("api-key", apiKey)
                    .header("accept", "application/json")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();

            LOGGER.info("Verification email accepted by Brevo.");

        } catch (RestClientResponseException e) {
            LOGGER.error(
                    "Brevo rejected email. HTTP status: {}, response: {}",
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

            throw new IllegalStateException(
                    "Brevo email API rejected request with HTTP "
                            + e.getStatusCode(),
                    e
            );

        } catch (RestClientException e) {
            LOGGER.error("Failed to connect to Brevo API.", e);

            throw new IllegalStateException(
                    "Failed to send email using Brevo API.",
                    e
            );
        }
    }
}