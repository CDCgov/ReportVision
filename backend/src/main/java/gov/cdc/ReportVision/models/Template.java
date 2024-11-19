package gov.cdc.ReportVision.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;

@Entity
@Getter
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class Template extends BaseEntity {

  @Valid
  @Id
  @GeneratedValue(generator = "UUID4")
  @Column(updatable = false, nullable = false)
  @JsonProperty
  private UUID id;

  @NotBlank(message = "Name is required")
  private String name;

  private String description;

  @NotBlank(message = "Lab name is required")
  private String labName;

  @OneToMany(mappedBy = "template")
  private List<Page> pages;

  @Enumerated(EnumType.STRING)
  @Builder.Default
  private TemplateStatus status = TemplateStatus.IN_PROGRESS;

  @ManyToOne private Organization organization;

  public Template(
      UUID id,
      String name,
      String description,
      String labName,
      List<Page> pages,
      TemplateStatus status,
      Organization organization) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.labName = labName;
    this.status = status;
    this.organization = organization;
    this.pages = pages;
  }

  public Template() {}
}
