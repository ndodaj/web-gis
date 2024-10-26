package al.webgis.webgis.service;

import al.webgis.webgis.entity.TokenEntity;
import al.webgis.webgis.entity.UserEntity;
import al.webgis.webgis.model.AuthenticationRequest;
import al.webgis.webgis.model.AuthenticationResponse;
import al.webgis.webgis.model.TokenType;
import al.webgis.webgis.model.UserDetailsResponse;
import al.webgis.webgis.model.UserDto;
import al.webgis.webgis.repository.TokenRepository;
import al.webgis.webgis.repository.UserRepository;
import al.webgis.webgis.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;


    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractEmail(refreshToken);
        List<String> roles = jwtService.extractAuthorities(refreshToken);
        if (userEmail != null) {
            Optional<UserEntity> byEmail = userRepository.findByEmail(userEmail);
            UserEntity user = byEmail.orElseThrow(() -> new UsernameNotFoundException(userEmail));
            if (jwtService.isTokenValid(refreshToken, user.getEmail())) {
                AuthenticationResponse authenticationResponse = jwtService.generateToken(userEmail, roles);
                revokeAllUserTokens(user);
                saveUserToken(user, authenticationResponse.getToken());
                new ObjectMapper().writeValue(response.getOutputStream(), authenticationResponse);
            }
        }
    }

    private void revokeAllUserTokens(UserEntity entity) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(entity.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(UserEntity userEntity, String jwtToken) {
        TokenEntity entity = new TokenEntity();
        entity.setUser(userEntity);
        entity.setToken(jwtToken);
        entity.setTokenType(TokenType.BEARER);
        entity.setRevoked(false);
        entity.setExpired(false);
        tokenRepository.save(entity);
    }


    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest, HttpServletRequest request) {
        UserDetailsResponse userDetailsResponse = userService.loadUserByCredentials(authenticationRequest);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(),
                authenticationRequest.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);

        // Create a new session and add the security context.
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

        return jwtService.generateToken(userDetailsResponse.getEmail(), userDetailsResponse.getRoles());

    }

    public AuthenticationResponse register(UserDto request) {
        return null;
    }
}
