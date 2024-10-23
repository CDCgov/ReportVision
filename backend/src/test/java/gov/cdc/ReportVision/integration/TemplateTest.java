package gov.cdc.ReportVision.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import gov.cdc.ReportVision.models.Template;
import gov.cdc.ReportVision.repositories.TemplateRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
// @ActiveProfiles("test") // Use the 'test' profile
public class TemplateTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private TemplateRepository templateRepository;

  @BeforeEach
  public void setup() {
    templateRepository.deleteAll();
  }

  @AfterEach
  public void tearDown() {
    templateRepository.deleteAll();
  }

  @Test
  public void testRequestCors() throws Exception {

    var template = Template.builder().name("Test Template").labName("My Lab").build();

    templateRepository.save(template);

    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/templates")
                // The specific origin doesn't matter, just that we set it so the
                // server will respond with the correct header
                .header("Origin", "https://reportvision.skylight.digital"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "*"))
        .andExpect(jsonPath("$._embedded.templates[0].name").value("Test Template"))
        .andExpect(jsonPath("$._embedded.templates[0].labName").value("My Lab"));
  }
}
