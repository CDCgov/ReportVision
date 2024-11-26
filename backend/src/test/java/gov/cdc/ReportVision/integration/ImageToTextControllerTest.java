package gov.cdc.ReportVision.integration;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.*;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;


import java.util.Base64;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.fastapi.url=http://localhost:8000"
})
public class ImageToTextControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RestTemplate restTemplate;

    private String sourceImageBase64;
    private String segmentationTemplateBase64;
    private String validLabelsJson;


    @BeforeEach
    public void setup() {
        sourceImageBase64 = Base64.getEncoder().encodeToString("mock image content".getBytes());
        segmentationTemplateBase64 = Base64.getEncoder().encodeToString("mock template content".getBytes());


        validLabelsJson = "[" +
                "{" +
                "\"label\": \"name\"," +
                "\"type\": \"text\"," +
                "\"color\": \"184,225,204\"" +
                "}," +
                "{" +
                "\"label\": \"age\"," +
                "\"type\": \"text\"," +
                "\"color\": \"20,52,176\"" +
                "}" +
                "]";
    }


    @Test
    public void testSuccessfulImageToTextConversion() throws Exception {

        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        )).thenReturn(
                new ResponseEntity<>("{\"text\": \"Extracted text from image\"}", HttpStatus.OK)
        );

        mockMvc.perform(post("/api/image_file_to_text")
                        .param("source_image", "data:image/png;base64," + sourceImageBase64)
                        .param("segmentation_template", "data:image/png;base64," + segmentationTemplateBase64)
                        .param("labels", validLabelsJson)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                )
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Extracted text from image")));
    }

    @Test
    public void testImageToTextWithMissingParameters() throws Exception {
        mockMvc.perform(post("/api/image_file_to_text")
                        .param("labels", validLabelsJson)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testImageToTextExternalServiceError() throws Exception {
        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        )).thenThrow(new HttpClientErrorException(
                HttpStatus.BAD_REQUEST,
                "External service error"
        ));


    }

    @Test
    public void testImageToTextWithUnsupportedImageFormat() throws Exception {
        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        )).thenAnswer(invocation -> {
            String url = invocation.getArgument(0);
            HttpEntity<?> requestEntity = invocation.getArgument(2);

            // If the source_image param is invalid
            if (requestEntity.getBody().toString().contains("this_is_not_a_valid_base64_encoded_string")) {
                throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Invalid Base64 encoding");
            }

            // If labels contain an invalid color value
            if (requestEntity.getBody().toString().contains("invalid-color")) {
                throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Invalid label format");
            }

            // Otherwise, return a valid response
            return new ResponseEntity<>("{\"text\": \"Extracted text from image\"}", HttpStatus.OK);
        });


        String invalidBase64Data = "data:image/png;base64,this_is_not_a_valid_base64_encoded_string";

        mockMvc.perform(post("/api/image_file_to_text")
                        .param("source_image", invalidBase64Data)
                        .param("segmentation_template", "data:image/png;base64," + segmentationTemplateBase64)
                        .param("labels", validLabelsJson)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                )
                .andDo(result -> {
                    System.out.println("Response Status: " + result.getResponse().getStatus());
                    System.out.println("Response Body: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isBadRequest());
    }


}






