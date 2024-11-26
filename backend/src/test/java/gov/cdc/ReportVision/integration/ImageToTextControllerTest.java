package gov.cdc.ReportVision.integration;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
public class ImageToTextControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RestTemplate restTemplate;

    private MockMultipartFile sourceImage;
    private MockMultipartFile segmentationTemplate;
    private MockMultipartFile labelsFile;

    @BeforeEach
    public void setup() {
        sourceImage = new MockMultipartFile(
                "source_image",
                "source.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "mock image content".getBytes()
        );

        segmentationTemplate = new MockMultipartFile(
                "segmentation_template",
                "template.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "mock template content".getBytes()
        );


        String validLabelsJson = "[" +
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

        labelsFile = new MockMultipartFile(
                "labels",
                "labels.json",
                MediaType.APPLICATION_JSON_VALUE,
                validLabelsJson.getBytes()
        );
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

        mockMvc.perform(multipart("/api/image_to_text")
                        .file(sourceImage)
                        .file(segmentationTemplate)
                        .file(labelsFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                )
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Extracted text from image")));
    }

    @Test
    public void testImageToTextWithMissingFiles() throws Exception {
        mockMvc.perform(multipart("/api/image_to_text")
                        .file(labelsFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
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


        mockMvc.perform(multipart("/api/image_to_text")
                        .file(sourceImage)
                        .file(segmentationTemplate)
                        .file(labelsFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                )
                .andExpect(status().isBadRequest());
    }


    @Test
    public void testImageToTextWithUnsupportedFileType() throws Exception {

        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        )).thenThrow(new HttpClientErrorException(
                HttpStatus.BAD_REQUEST,
                "External service error"
        ));


        MockMultipartFile invalidFile = new MockMultipartFile(
                "source_image",
                "document.txt",
                MediaType.TEXT_XML_VALUE,
                "Not an image".getBytes()
        );


        mockMvc.perform(multipart("/api/image_to_text")
                        .file(invalidFile)
                        .file(segmentationTemplate)
                        .file(labelsFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                )
                .andDo(result -> {
                    System.out.println("Response Status: " + result.getResponse().getStatus());
                    System.out.println("Response Body: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testImageToTextWithInvalidLabelsFormat() throws Exception {

        String invalidLabelsJson = "[" +
                "{" +
                "\"label\": \"name\"," +
                "\"type\": \"text\"," +
                "\"color\": \"invalid-color\"" +
                "}" +
                "]";

        mockMvc.perform(multipart("/api/image_to_text")
                        .file(sourceImage)
                        .file(segmentationTemplate)
                        .param("labels", invalidLabelsJson)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                )
                .andExpect(status().isBadRequest());
    }

}