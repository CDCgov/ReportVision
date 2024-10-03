package gov.cdc.ReportVision.models;


import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Label extends BaseEntity {
    @Id
    @GeneratedValue(generator = "UUID4")
    @Column(updatable = false, nullable = false)
    private UUID id;
    private String color;
    private String humanReadableName;
    private boolean required;
}