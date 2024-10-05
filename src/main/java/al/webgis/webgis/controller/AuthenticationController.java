package al.webgis.webgis.controller;

import al.webgis.webgis.model.AuthenticationRequest;
import al.webgis.webgis.model.AuthenticationResponse;
import al.webgis.webgis.security.JwtUtil;
import al.webgis.webgis.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class AuthenticationController {


    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthenticationController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/authenticate")
    public String createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {
        AuthenticationResponse authenticationResponse = userService.loadUserByCredentials(authenticationRequest);
        return jwtUtil.generateToken(authenticationResponse.username(), authenticationResponse.roles());
    }


}

