package com.example.demo.security.jwt;

import com.example.demo.appuser.AppUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AppUserService appUserService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();

        // =========================================================
        // ALLOW CORS PREFLIGHT REQUEST
        // =========================================================

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (path.equals("/api/v1/auth/login")
                || path.equals("/api/v1/auth/register")
                || path.startsWith("/api/v1/auth/confirm")) {

            filterChain.doFilter(request, response);
            return;
        }


        String authHeader = request.getHeader("Authorization");

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            String username = jwtUtil.extractUsername(token);

            if (username != null
                    && SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                UserDetails userDetails =
                        appUserService.loadUserByUsername(username);


                if (jwtUtil.isTokenValid(token, userDetails)) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR: " + e.getMessage()
            );

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "Token error: " + e.getMessage()
            );

            return;
        }

        filterChain.doFilter(request, response);
    }
}
