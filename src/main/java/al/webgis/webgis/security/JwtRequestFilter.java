package al.webgis.webgis.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;

@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;

    public static final String AUTHORIZATION_HEADER = "Authorization";

    public JwtRequestFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Skip the filter for the /authenticate endpoint
        String requestURI = request.getRequestURI();
        if ("/authenticate".equals(requestURI) || requestURI.startsWith("/swagger-ui") || requestURI.startsWith("/v3/api-docs")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
            // No JWT token found - return 401 Unauthorized
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json");
//
//            SecurityException se = new SecurityException("Invalid JWT token");
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json");
//            String s = convertObjectToJson(se);
//            response.getWriter().write(s);
//            return;
        }
        String jwt = authHeader.substring(7);
        if(SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                Claims claims = jwtUtil.validateToken(jwt.trim());
                Collection<? extends GrantedAuthority> authorities = Arrays
                        .stream(claims.get("auth").toString().split(",")).map(SimpleGrantedAuthority::new)
                        .toList();
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetailsService,
                        null,
                        authorities
            );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (SecurityException | MalformedJwtException e) {
                log.info("Invalid JWT signature.");
                log.trace("Invalid JWT signature trace: {}", e.getMessage());
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setCharacterEncoding("UTF-8"); // Ensure character encoding
                response.getWriter().write(convertObjectToJson(e));
                return;
            } catch (ExpiredJwtException e) {
                log.info("Expired JWT token.");
                log.trace("Expired JWT token trace: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8"); // Ensure character encoding
                response.getWriter().write(convertObjectToJson(e));
                return;
            } catch (UnsupportedJwtException e) {
                log.info("Unsupported JWT token.");
                log.trace("Unsupported JWT token trace: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8"); // Ensure character encoding
                response.getWriter().write(convertObjectToJson(e));
                return;
            } catch (IllegalArgumentException e) {
                log.info("JWT token compact of handler are invalid.");
                log.trace("JWT token compact of handler are invalid trace: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8"); // Ensure character encoding
                response.getWriter().write(convertObjectToJson(e));
                return;
            } catch (SignatureException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8"); // Ensure character encoding
                response.getWriter().write(convertObjectToJson(e));
                return;
            }


        }






        chain.doFilter(request, response);
    }

    public String convertObjectToJson(Exception ex) throws JsonProcessingException {
        if (ex == null) {
            return null;
        }
        ex.setStackTrace(new StackTraceElement[0]);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(ex);
    }


}

