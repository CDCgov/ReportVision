package gov.cdc.ReportVision.models;

import jakarta.persistence.*;

@Entity
public class Notification extends BaseEntity {
    @Id
    private String id;

    @ManyToOne
    private Organization organization;

    private String content;
}