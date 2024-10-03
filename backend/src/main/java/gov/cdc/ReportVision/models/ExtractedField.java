package gov.cdc.ReportVision.models;

import jakarta.persistence.*;

@Entity
public class ExtractedField extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private String value;

    private Double confidence; // Optional

    @ManyToOne
    private Extraction extraction;
}