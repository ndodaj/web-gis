package al.webgis.webgis.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserRegistrationDto(

        @NotBlank(message = "{user.username.notBlank}")
        String username,

        @Email(message = "Email should be valid")
        @NotBlank(message = "Email is mandatory")
        String email,

        @NotBlank(message = "First name is mandatory")
        String firstName,

        @NotBlank(message = "Last name is mandatory")
        String lastName,

        @NotNull(message = "Birthday is mandatory")
        @Past(message = "Birthday must be a past date")
        LocalDate birthday,

        @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Mobile phone number is invalid")
        @NotBlank(message = "Mobile phone number is mandatory")
        String mobilePhone,

        @NotBlank(message = "Address is mandatory")
        String address,

        @NotBlank(message = "Password is mandatory")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @NotNull(message = "Account type is mandatory")
        AccountType accountType
) {
}