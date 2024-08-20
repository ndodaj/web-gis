package al.webgis.webgis.converter;

import al.webgis.webgis.entity.UserEntity;
import al.webgis.webgis.model.UserDto;
import al.webgis.webgis.model.UserRegistrationDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UserConverter {

    private final PasswordEncoder passwordEncoder;

    public UserConverter(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity toEntity(UserRegistrationDto userRegistrationDto) {
        UserEntity entity = new UserEntity();
        entity.setUsername(userRegistrationDto.username());
        entity.setEmail(userRegistrationDto.email());
        entity.setFirstName(userRegistrationDto.firstName());
        entity.setLastName(userRegistrationDto.lastName());
        entity.setBirthday(userRegistrationDto.birthday());
        entity.setMobilePhone(userRegistrationDto.mobilePhone());
        entity.setAddress(userRegistrationDto.address());
        entity.setPassword(passwordEncoder.encode(userRegistrationDto.password()));
        entity.setAccountType(userRegistrationDto.accountType());
        return entity;
    }

    public UserDto toDto(UserEntity entity) {
        return new UserDto(
                entity.getId(),
                entity.getUsername()
        );
    }

    public UserEntity toEntity(UserDto dto) {
        UserEntity entity = new UserEntity();
        entity.setId(dto.id());
        entity.setUsername(dto.username());
        return entity;
    }
}
