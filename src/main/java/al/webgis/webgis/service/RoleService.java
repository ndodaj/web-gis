package al.webgis.webgis.service;

import al.webgis.webgis.converter.RoleConverter;
import al.webgis.webgis.entity.RoleEntity;
import al.webgis.webgis.model.RoleDto;
import al.webgis.webgis.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RoleService {

    private final RoleRepository roleRepository;

    private final RoleConverter roleConverter;

    public RoleService(RoleRepository roleRepository, RoleConverter roleConverter) {
        this.roleRepository = roleRepository;
        this.roleConverter = roleConverter;
    }

    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(roleConverter::toDto)
                .toList();
    }

    public Optional<RoleDto> getRoleById(Long id) {
        return roleRepository.findById(id)
                .map(roleConverter::toDto);
    }

    public RoleDto saveRole(RoleDto roleDto) {
        RoleEntity role = roleConverter.toEntity(roleDto);
        RoleEntity savedRole = roleRepository.save(role);
        return roleConverter.toDto(savedRole);
    }

    public RoleDto updateRole(Long id, RoleDto roleDetails) {
        RoleEntity role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        role.setName(roleDetails.name());
        RoleEntity updatedRole = roleRepository.save(role);
        return roleConverter.toDto(updatedRole);
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}


