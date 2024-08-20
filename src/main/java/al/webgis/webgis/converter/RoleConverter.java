package al.webgis.webgis.converter;

import al.webgis.webgis.entity.RoleEntity;
import al.webgis.webgis.model.RoleDto;
import org.springframework.stereotype.Component;

@Component
public class RoleConverter {

    public RoleDto toDto(RoleEntity entity) {
        return new RoleDto(
                entity.getName(),
                entity.getStatus(),
                entity.getDescription()
        );
    }

    public RoleEntity toEntity(RoleDto dto) {
        RoleEntity entity = new RoleEntity();
        entity.setName(dto.name());
        entity.setStatus(dto.status());
        entity.setDescription(dto.description());
        return entity;
    }
}
