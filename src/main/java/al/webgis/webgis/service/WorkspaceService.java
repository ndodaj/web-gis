package al.webgis.webgis.service;

import al.webgis.webgis.model.workspace.CreateWorkspaceDTO;
import al.webgis.webgis.model.workspace.WorkspaceDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class WorkspaceService {

    @Value("${geoserver.username}")
    private String username;

    @Value("${geoserver.password}")
    private String password;

    @Value("${geoserver.url}")
    private String geoServerUrl;


    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public WorkspaceService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        // Add basic authentication
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("admin", "geoserver")
        );
    }

    public Page<WorkspaceDTO> getAllWorkspaces(Pageable pageable) {
        return null;
    }

    public WorkspaceDTO getWorkspace(String workspaceName) {
        return null;
    }

    public CreateWorkspaceDTO createWorkspace(CreateWorkspaceDTO createWorkspaceDTO) {
        return null;
    }

    public ResponseEntity<CreateWorkspaceDTO> updateWorkspace(CreateWorkspaceDTO workspaceDTO, String workspaceName) {
        return null;
    }

    public void deleteWorkspace(String workspaceName) {
    }
}
