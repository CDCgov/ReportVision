package gov.cdc.ReportVision.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Extraction extends BaseEntity {
    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    private ExtractionStatus status;

    @ManyToOne
    private Template segmentationTemplate;

    @ElementCollection
    private List<byte[]> pages;

    @OneToMany(mappedBy = "extraction")
    private List<ExtractedField> fields;

    @OneToMany(mappedBy = "extraction")
    private List<ExtractedField> corrections;
}
