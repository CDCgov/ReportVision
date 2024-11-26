package gov.cdc.ReportVision.controllers;



import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/api")
@Slf4j
public class ImageToTextController {

    private final RestTemplate restTemplate;

    public ImageToTextController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Value("${spring.fastapi.url}/image_to_text")
    private String fastApiUrl;

    @PostMapping(value = "/image_file_to_text", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> imageToText(
            @RequestParam("source_image") String sourceImage,
            @RequestParam("segmentation_template") String segmentationTemplate,
            @RequestParam("labels") String labels) {
        try {
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("source_image", sourceImage);
            body.add("segmentation_template", segmentationTemplate);
            body.add("labels", labels);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    fastApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );
            System.out.println(response.getBody());
            return ResponseEntity.status(response.getStatusCode())
                    .headers(response.getHeaders())
                    .body(response.getBody());
        } catch (HttpClientErrorException e) {
            log.error("Client error when calling FastAPI service", e);
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Unexpected error when processing request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected server error occurred: " + e.getMessage());
        }
    }
}
