package gov.cdc.ReportVision.models;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class TemplateTest {

    @Test
    public void testTemplateValidations() {
        try(ValidatorFactory factory = Validation.buildDefaultValidatorFactory()){
            Validator validator = factory.getValidator();
            Template template = Template.builder().build();

            Set<ConstraintViolation<Template>> violations = validator.validate(template);
            Assertions.assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
                    "Name is required",
                    "Lab name is required"
            );
        }
    }

}
