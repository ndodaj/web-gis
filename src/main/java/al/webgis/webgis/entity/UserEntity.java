package al.webgis.webgis.entity;


import al.webgis.webgis.model.AccountType;
import al.webgis.webgis.model.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@Entity
@Table(name = "users")
public class UserEntity extends AuditEntity<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Integer id;

    @NotBlank
    @Size(min = 5, max = 45)
    @Column(unique = true, nullable = false, name = "username")
    private String username;

    @NotBlank
    @Size(max = 255)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank
    @Size(max = 255)
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotBlank
    @Email(message = "Email is not valid") // create a file tha contains all validation messages
    @Column(name = "email", nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false, name = "password")
    private String password;

    @NotNull
    @Column(name = "birthday")
    private LocalDate birthday;

    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Mobile phone number is invalid")
    @NotBlank(message = "Mobile phone number is mandatory")
    private String mobilePhone;

    @NotBlank(message = "Address is mandatory")
    @Column(name = "address")
    private String address;

    @NotNull
    @Column(name = "account_type")
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusEnum status;

    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<RoleEntity> roles;

}


