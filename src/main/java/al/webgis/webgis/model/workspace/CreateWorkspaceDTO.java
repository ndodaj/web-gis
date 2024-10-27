package al.webgis.webgis.model.workspace;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateWorkspaceDTO {

    private WorkspaceNameDTO workspace;

    @Getter
    @Setter
    private static class WorkspaceNameDTO {
        private String name;
    }

}
