package gov.cdc.ReportVision.models;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@Entity
public class Page extends BaseEntity {
    @Id
    @GeneratedValue(generator = "UUID4")
    @Column(updatable = false, nullable = false)
    private UUID id;

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