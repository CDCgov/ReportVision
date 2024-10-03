package gov.cdc.ReportVision.models;

import jakarta.persistence.*;

@Entity
public class Organization extends BaseEntity {
    @Id
    private String id;

    private String name;

    @ManyToOne
    private User admin;
}