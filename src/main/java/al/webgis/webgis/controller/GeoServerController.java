package al.webgis.webgis.controller;

import al.webgis.webgis.service.GeoServerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GeoServerController {

    private final GeoServerService geoServerService;

    public GeoServerController(GeoServerService geoServerService) {
        this.geoServerService = geoServerService;
    }

    @GetMapping("/geoserver/info")
    public String getGeoServerInfo() {
        return geoServerService.getGeoServerInfo();
    }
}