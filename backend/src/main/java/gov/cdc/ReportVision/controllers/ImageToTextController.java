package gov.cdc.ReportVision.controllers;



import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@Slf4j
public class ImageToTextController {

    private final RestTemplate restTemplate;

    public ImageToTextController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping(value = "/image_to_text", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> imageToText(@RequestPart("source_image") MultipartFile sourceImage,
                                       @RequestPart("segmentation_template") MultipartFile segmentationTemplate,
                                       @RequestPart("labels") String labels) {
        try {

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            // Convert MultipartFile to Resource-based parts
            body.add("source_image", createFilePart(sourceImage));
            body.add("segmentation_template", createFilePart(segmentationTemplate));
            body.add("labels", labels);


            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);


            String url = "http://localhost:8000/image_file_to_text/";
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
            );

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

    private HttpEntity<?> createFilePart(MultipartFile file) throws IOException {
        HttpHeaders fileHeaders = new HttpHeaders();
        fileHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);
        fileHeaders.setContentDispositionFormData(file.getName(), file.getOriginalFilename());

        return new HttpEntity<>(file.getResource(), fileHeaders);
    }
}