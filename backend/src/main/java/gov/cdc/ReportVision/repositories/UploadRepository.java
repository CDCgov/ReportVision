package gov.cdc.ReportVision.repositories;

import gov.cdc.ReportVision.models.Template;
import gov.cdc.ReportVision.models.Upload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UploadRepository extends JpaRepository<Upload, UUID> {
}
