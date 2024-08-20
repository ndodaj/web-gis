package al.webgis.webgis.controller;

import al.webgis.webgis.model.UserDto;
import al.webgis.webgis.model.UserRegistrationDto;
import al.webgis.webgis.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "User management APIs")
@Validated
@Slf4j
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve a list of all users")

    public List<UserDto> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a user by ID", description = "Retrieve a user by their ID")

    public Optional<UserDto> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    @Operation(summary = "Register a new user in the system",
            description = "Register a new user in the system. User is validated"

    )

    public UserDto createUser(@RequestBody UserDto userDTO) {
        return userService.saveUser(userDTO);
    }

    @Operation(
            summary = "Register a new user",
            description = "Registers a new user with the provided details",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegistrationDto userRegistrationDto) {
        // Handle user registration
        log.trace("User to be registered: {}", userRegistrationDto.toString());
        log.info("User to be registered: {}", userRegistrationDto);
        userService.registerUser(userRegistrationDto);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a user", description = "Update an existing user by their ID")

    public UserDto updateUser(@PathVariable Long id, @RequestBody UserDto userDetails) {
        return userService.updateUser(id, userDetails);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user", description = "Delete a user by their ID")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
