package al.webgis.webgis.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class AuditEntity<U> {

    @CreatedDate
    @Column(name = "created_date", updatable = false, nullable = false)
    @NotNull
    protected LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date", nullable = false)
    @NotNull
    protected LocalDateTime lastModifiedDate;

    @CreatedBy
    @Column(name = "created_by", updatable = false, nullable = false)
    @NotNull
    protected U createdBy;

    @LastModifiedBy
    @Column(name = "last_modified_by", nullable = false)
    @NotNull
    protected U lastModifiedBy;
}