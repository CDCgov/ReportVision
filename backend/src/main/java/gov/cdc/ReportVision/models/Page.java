package gov.cdc.ReportVision.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Page extends BaseEntity {
    @Id
    private String id;

    @Lob
    private byte[] baseImage;

    @Lob
    private byte[] segmentationTemplate;

//    @OneToMany(mappedBy = "page")
//    private List<Label> labels;

    // TODO: Figure out how to map this to a Shape entity
//    @OneToMany(mappedBy = "page")
//    private List<Shape> shapes; // Assuming Shape is another entity

    @ManyToOne
    private Template template;
}