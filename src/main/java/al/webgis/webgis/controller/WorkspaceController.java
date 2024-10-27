package al.webgis.webgis.controller;

import al.webgis.webgis.model.workspace.CreateWorkspaceDTO;
import al.webgis.webgis.model.workspace.WorkspaceDTO;
import al.webgis.webgis.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/geoserver/workspaces")
@Tag(name = "Workspaces - Geo Server APIs", description = "Workspaces - Geo Server APIs")
@Slf4j
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }


    @GetMapping
    @Operation(summary = "Retrieve all workspaces", description = "Retrieve all workspaces")
    public ResponseEntity<Page<WorkspaceDTO>> getWorkspaces(Pageable pageable) {
        return ResponseEntity.ok(workspaceService.getAllWorkspaces(pageable));
    }

    @Operation(summary = "Retrieve workspace by name", description = "Retrieve workspace by name")
    @GetMapping("/{workspaceName}")
    public ResponseEntity<WorkspaceDTO> getWorkspace(@PathVariable String workspaceName) {
        return ResponseEntity.ok(workspaceService.getWorkspace(workspaceName));
    }

    @PostMapping
    public ResponseEntity<CreateWorkspaceDTO> createWorkspace(@RequestBody CreateWorkspaceDTO createWorkspaceDTO) {
        return ResponseEntity.ok(workspaceService.createWorkspace(createWorkspaceDTO));
    }

    @PutMapping("/{workspaceName}")
    public ResponseEntity<CreateWorkspaceDTO> updateWorkspace(@PathVariable String workspaceName,
                                                              @RequestBody CreateWorkspaceDTO workspaceDTO) {
        return workspaceService.updateWorkspace(workspaceDTO, workspaceName);
    }

    @DeleteMapping("/{workspaceName}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable String workspaceName) {
        workspaceService.deleteWorkspace(workspaceName);
        return ResponseEntity.ok().build();
    }

}
