package gov.cdc.ReportVision.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
public class User extends BaseEntity {

    @Id
    @GeneratedValue(generator = "UUID4")
    @Column(updatable = false, nullable = false)
    private UUID id;

    private String name;
    private String email;
    private String password; // Should be hashed and salted
//
//    @OneToOne
//    private Organization organization;
}