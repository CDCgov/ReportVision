package gov.cdc.ReportVision.models;

import jakarta.persistence.*;

@Entity
public class User extends BaseEntity {
    @Id
    private String id;

    private String name;
    private String email;
    private String password; // Should be hashed and salted

    @ManyToOne
    private Organization organization;
}