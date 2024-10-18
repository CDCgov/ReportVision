package gov.cdc.ReportVision.repositories;


import gov.cdc.ReportVision.models.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.UUID;

@CrossOrigin(origins = "*")
public interface TemplateRepository extends JpaRepository<Template, UUID> {

}
