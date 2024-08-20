package al.webgis.webgis.entity;

import al.webgis.webgis.model.RoleEnum;
import al.webgis.webgis.model.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class RoleEntity extends AuditEntity<String> {

    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    private RoleEnum name;

    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusEnum status;
}
