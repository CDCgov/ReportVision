package gov.cdc.ReportVision.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Upload extends BaseEntity {
    @Id
    private String id;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private User updatedBy;

//    @OneToMany(mappedBy = "upload")
//    private List<Extraction> extractions;
}