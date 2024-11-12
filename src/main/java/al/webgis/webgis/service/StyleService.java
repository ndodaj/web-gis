package al.webgis.webgis.service;

import al.webgis.webgis.model.styles.CreateStyleDTOWrapper;
import al.webgis.webgis.model.styles.RetrieveSingleStyleDto;
import al.webgis.webgis.model.styles.RetrieveSingleStyleDtoWrapper;
import al.webgis.webgis.model.styles.StyleDTO;
import al.webgis.webgis.model.styles.CreateStyleDTO;
import al.webgis.webgis.model.styles.StylesWrapper;
import al.webgis.webgis.model.styles.create.NamedLayer;
import al.webgis.webgis.model.styles.create.StyledLayerDescriptor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.xml.bind.JAXB;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Marshaller;
import lombok.extern.slf4j.Slf4j;
import org.json.XML;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.StringWriter;
import java.text.MessageFormat;
import java.util.Base64;
import java.util.Collections;
import java.util.List;


@Service
@Slf4j
public class StyleService {

    @Value("${geoserver.username}")
    private String username;

    @Value("${geoserver.password}")
    private String password;

    @Value("${geoserver.url}")
    private String geoServerUrl;


    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public StyleService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        // Add basic authentication
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("admin", "geoserver")
        );
    }

    public Page<StyleDTO> getAllStyles(Pageable pageable, String workspaceName) {
        StylesWrapper styles = null;
        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        String url;
        if (workspaceName != null) {
            url = String.format("%s/rest/workspaces/%s/styles.json", geoServerUrl, workspaceName);
        } else {
            url = String.format("%s/rest/styles.json", geoServerUrl);
        }

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        try {
            styles = objectMapper.readValue(response.getBody(), StylesWrapper.class);

        } catch (JsonProcessingException e) {
            e.printStackTrace(); // @TODO handle in a controller advice
        }

        if(styles == null || styles.getStyles().getStyle() == null) {
            return new PageImpl<>(Collections.emptyList());
        }

        List<StyleDTO> output = styles.getStyles().getStyle();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), output.size());
        List<StyleDTO> paginatedList = output.subList(start, end);

        return new PageImpl<>(paginatedList, pageable, output.size());
    }

    public RetrieveSingleStyleDto getStyle(String styleName, String workspaceName) {
        RetrieveSingleStyleDto output = null;
        RetrieveSingleStyleDtoWrapper wrapper = null;
        String url;
        if (workspaceName != null) {
            url = String.format("%s/rest/workspaces/%s/styles/%s.json", geoServerUrl, workspaceName, styleName);
        } else {
            url = String.format("%s/rest/styles/%s.json", geoServerUrl, styleName);
        }

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);


        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        try {
           wrapper  = objectMapper.readValue(response.getBody(), RetrieveSingleStyleDtoWrapper.class);
           output = wrapper.getStyle();

        } catch (JsonProcessingException e) {
            e.printStackTrace(); // @TODO handle in a controller advice
        }
        return output;
    }

    public NamedLayer namedLayer(NamedLayer style, String workspaceName) {
        NamedLayer output = null;
        String url;
        if (workspaceName != null) {
            url = String.format("%s/rest/workspaces/%s/styles.json?name=vvv", geoServerUrl, workspaceName);
        } else {
            url = String.format("%s/rest/styles.json?name=vvvvv", geoServerUrl);
        }


        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
//        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentType(MediaType.parseMediaType("application/vnd.ogc.sld+xml"));
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        String xml = buildInsertLayerXML(style);
        String sldContent = """
    <?xml version="1.0" encoding="UTF-8"?>
    <StyledLayerDescriptor version="1.0.0" 
        xmlns="http://www.opengis.net/sld" 
        xmlns:ogc="http://www.opengis.net/ogc" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
        
        <NamedLayer>
            <Name>vnvnvnvnvn</Name>
            <Title>test aaaaaa</Title>
            <UserStyle>
                <Name>bbbbb</Name>
                <Title>aaa title</Title>
                <Abstract>A simple style to display polygons with a light blue fill and a black border</Abstract>
                <FeatureTypeStyle>
                    <Rule>
                        <Name>Polygon rule</Name>
                        <Title>Blue fill with black border</Title>
                        <PolygonSymbolizer>
                            <Fill>
                                <CssParameter name="fill">#ADD8E6</CssParameter>
                            </Fill>
                            <Stroke>
                                <CssParameter name="stroke">#000000</CssParameter>
                                <CssParameter name="stroke-width">1</CssParameter>
                            </Stroke>
                        </PolygonSymbolizer>
                    </Rule>
                </FeatureTypeStyle>
            </UserStyle>
        </NamedLayer>
    </StyledLayerDescriptor>
    """; // puti teknikisht do i kete te gjitha
         // style do krijohet me vete, pastaj do kemi mundesine tja asenjojme cdo layeri

        HttpEntity<String> entity = new HttpEntity<>(xml, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//        try {
//            output = objectMapper.readValue(response.getBody(), CreateStyleDTO.class);
//
//        } catch (JsonProcessingException e) {
//            e.printStackTrace(); // @TODO handle in a controller advice
//        }
        return output;
    }

    public String convertNamedLayerToXml(StyledLayerDescriptor style) throws JAXBException {

        StringWriter sw = new StringWriter();
        JAXB.marshal(style, sw);
        String xmlString = sw.toString();

        return xmlString;
    }

    public ResponseEntity<CreateStyleDTO> updateStyle(CreateStyleDTO styleDTO, String styleName) {
        return null;
    }

    public void deleteStyle(String styleName) {
    }


    private String buildInsertLayerXML(NamedLayer namedLayer) {

        if(namedLayer != null
                && namedLayer.getUserStyle() != null
                && namedLayer.getUserStyle().getFeatureTypeStyle() != null
                && namedLayer.getUserStyle().getFeatureTypeStyle().getRule() != null
                && namedLayer.getUserStyle().getFeatureTypeStyle().getRule().getFilter() != null
        ){
            StringBuilder filter = new StringBuilder();
            filter.append("<Filter>");
            filter.append("<PropertyIsEqualTo>");
            filter.append("<PropertyIsEqualTo>");
            filter.append("<PropertyName>");
            filter.append("<Literal>").append(namedLayer);
        }





        String s = """
                <?xml version="1.0" encoding="UTF-8"?>
                <StyledLayerDescriptor version="1.0.0"\s
                    xmlns="http://www.opengis.net/sld"\s
                    xmlns:ogc="http://www.opengis.net/ogc"\s
                    xmlns:xlink="http://www.w3.org/1999/xlink"\s
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
                    <NamedLayer>
                        <Name>{0}</Name>
                        <Title>{1}</Title>
                        <UserStyle>
                            <Name>{2}</Name>
                            <Title>{3}</Title>
                            <Abstract>{4}</Abstract>
                            <FeatureTypeStyle>
                                <Rule>
                                    <Name>{5}</Name>
                                    <Title>{6}</Title>
                                    
               \s
               \s""";

               String out = MessageFormat.format(s, namedLayer.getName());





        log.info(out);

        return out;

    }

}
