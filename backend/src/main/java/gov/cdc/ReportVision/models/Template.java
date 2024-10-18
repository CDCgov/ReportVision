package gov.cdc.ReportVision.models;


import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
public class Template extends BaseEntity {

  @Valid

  @Id
  @GeneratedValue(generator = "UUID4")
  @Column(updatable = false, nullable = false)
  private UUID id;


  @NotBlank(message = "Name is required")
  private String name;
  private String description;
  @NotBlank(message = "Lab name is required")
  private String labName;

  @OneToMany(mappedBy = "template")
  private List<Page> pages;

  @Enumerated(EnumType.STRING)
  private TemplateStatus status = TemplateStatus.IN_PROGRESS;

  @ManyToOne
  private Organization organization;
}


