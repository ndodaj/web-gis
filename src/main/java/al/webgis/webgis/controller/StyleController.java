package al.webgis.webgis.controller;

import al.webgis.webgis.model.StyleDTO;
import al.webgis.webgis.model.styles.CreateStyleDTO;
import al.webgis.webgis.service.StyleService;
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
@RequestMapping("/geoserver/styles")
@Tag(name = "Styles - Geo Server APIs", description = "Styles - Geo Server APIs")
@Slf4j
public class StyleController {
    private final StyleService styleService;

    public StyleController(StyleService styleService) {
        this.styleService = styleService;
    }


    @GetMapping
    @Operation(summary = "Retrieve all styles", description = "Retrieve all styles")
    public ResponseEntity<Page<StyleDTO>> getstyles(Pageable pageable) {
        return ResponseEntity.ok(styleService.getAllStyles(pageable));
    }

    @Operation(summary = "Retrieve style by name", description = "Retrieve style by name")
    @GetMapping("/{styleName}")
    public ResponseEntity<StyleDTO> getstyle(@PathVariable String styleName) {
        return ResponseEntity.ok(styleService.getStyle(styleName));
    }

    @PostMapping
    public ResponseEntity<CreateStyleDTO> createstyle(@RequestBody CreateStyleDTO createstyleDTO) {
        return ResponseEntity.ok(styleService.createStyle(createstyleDTO));
    }

    @PutMapping("/{styleName}")
    public ResponseEntity<CreateStyleDTO> updatestyle(@PathVariable String styleName,
                                                      @RequestBody CreateStyleDTO styleDTO) {
        return styleService.updateStyle(styleDTO, styleName);
    }

    @DeleteMapping("/{styleName}")
    public ResponseEntity<Void> deletestyle(@PathVariable String styleName) {
        styleService.deleteStyle(styleName);
        return ResponseEntity.ok().build();
    }

}
