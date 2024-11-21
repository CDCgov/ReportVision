package gov.cdc.ReportVision.controllers;

import gov.cdc.ReportVision.config.FastApiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ImageToTextController {

    private final FastApiConfig fastApiConfig;

    @Autowired
    public ImageToTextController(FastApiConfig fastApiConfig) {
        this.fastApiConfig = fastApiConfig;
    }

    @PostMapping("/image_to_text")
    public ResponseEntity<?> imageToText(@RequestBody Map<String, Object> requestPayload) {

        try {
            //System.out.println("Incoming Payload: " + requestPayload);

            if (!requestPayload.containsKey("source_image") || !requestPayload.containsKey("segmentation_template") || !requestPayload.containsKey("labels")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing required fields: 'source_image', 'segmentation_template', or 'labels'");
            }


            String sourceImageBase64 = (String) requestPayload.get("source_image");
            String segmentationTemplateBase64 = (String) requestPayload.get("segmentation_template");
            String labels = (String) requestPayload.get("labels");
            System.out.println(labels);


            Map<String, Object> fastApiPayload = Map.of(
                    "source_image", sourceImageBase64,
                    "segmentation_template", segmentationTemplateBase64,
                    "labels", labels
            );


            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);


            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(fastApiPayload, headers);

            // Call the FastAPI service
            RestTemplate restTemplate = new RestTemplate();
            String fastApiUrl = fastApiConfig.getUrl() + "/image_file_to_text";
            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:8000/image_file_to_text", entity, String.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            // Handle errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the request: " + e.getMessage());
        }
    }
}
