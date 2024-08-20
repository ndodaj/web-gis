package al.webgis.webgis.service;

import al.webgis.webgis.converter.UserConverter;
import al.webgis.webgis.entity.UserEntity;
import al.webgis.webgis.model.AuthenticationRequest;
import al.webgis.webgis.model.AuthenticationResponse;
import al.webgis.webgis.model.UserDto;
import al.webgis.webgis.model.UserRegistrationDto;
import al.webgis.webgis.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Validated
public class UserService {

    private final UserRepository userRepository;

    private final UserConverter userConverter;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, UserConverter userConverter, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.userConverter = userConverter;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userConverter::toDto)
                .toList();
    }

    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id).map(userConverter::toDto);
    }

    public UserDto saveUser(UserDto userDto) {
        UserEntity entity = userConverter.toEntity(userDto);
        UserEntity savedEntity = userRepository.save(entity);
        return userConverter.toDto(savedEntity);
    }

    public UserDto updateUser(Long id, UserDto userDetails) {
        UserEntity entity = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        entity.setUsername(userDetails.username());
        // update other fields later
        UserEntity updatedUser = userRepository.save(entity);
        return userConverter.toDto(updatedUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void registerUser(@Valid UserRegistrationDto userRegistrationDto) {
        userRepository.save(userConverter.toEntity(userRegistrationDto));
    }

    public AuthenticationResponse loadUserByCredentials(AuthenticationRequest authenticationRequest) {
        UserEntity userEntity = userRepository.findByUsername(authenticationRequest.username())
                .orElseThrow(() -> new BadCredentialsException("User ot found"));
        if(!bCryptPasswordEncoder.matches(authenticationRequest.password(), userEntity.getPassword())) {
            throw new BadCredentialsException("Bad credentials");
        }
        List<String> roles = new ArrayList<>();
        userEntity.getRoles().forEach(role -> roles.add(role.getName().name()));
        return new AuthenticationResponse(authenticationRequest.username(), roles);




    }
}

