package gov.cdc.ReportVision.models;
import jakarta.persistence.*;

@Entity
public class FeatureFlag extends BaseEntity {
    @Id
    private String id;

    private String name;
    private boolean enabled;

    @ManyToOne
    private Organization organization;
}