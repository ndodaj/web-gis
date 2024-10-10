package al.webgis.webgis.controller;

import al.webgis.webgis.model.AuthenticationRequest;
import al.webgis.webgis.model.AuthenticationResponse;
import al.webgis.webgis.model.JwtDTO;
import al.webgis.webgis.security.JwtUtil;
import al.webgis.webgis.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class AuthenticationController {


    private final UserService userService;
    private final JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthenticationController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JwtDTO> authenticate(@RequestBody AuthenticationRequest authenticationRequest, HttpServletRequest request) {
        AuthenticationResponse authenticationResponse = userService.loadUserByCredentials(authenticationRequest);


        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(authenticationRequest.username(),
                authenticationRequest.password());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);

        // Create a new session and add the security context.
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

        return ResponseEntity.ok(jwtUtil.generateToken(authenticationResponse.username(), authenticationResponse.roles()));
    }


}

