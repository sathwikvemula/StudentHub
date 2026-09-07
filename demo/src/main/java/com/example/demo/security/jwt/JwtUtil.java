package com.example.demo.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

@Service
public class JwtUtil {

    private final Key SECRET_KEY =
            Keys.hmacShaKeyFor("mysupersecretkeymysupersecretkey".getBytes());


    public String generateToken(String username) {
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();

        System.out.println("JWT TOKEN: " + token);
        return token;
    }


    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }


    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }


    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}