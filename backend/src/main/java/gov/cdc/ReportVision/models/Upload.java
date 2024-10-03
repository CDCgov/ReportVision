package gov.cdc.ReportVision.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
public class Upload extends BaseEntity {
    @Id
    @GeneratedValue(generator = "UUID4")
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private User updatedBy;

//    @OneToMany(mappedBy = "upload")
//    private List<Extraction> extractions;
}