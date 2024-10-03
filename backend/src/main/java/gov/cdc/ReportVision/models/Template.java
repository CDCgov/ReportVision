package gov.cdc.ReportVision.models;


import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
public class Template extends BaseEntity {

  @Id
  @GeneratedValue(generator = "UUID4")
  @Column(updatable = false, nullable = false)
  private UUID id;


  public String name;
  public String description;
  public String labName;

  @OneToMany(mappedBy = "template")
  private List<Page> pages;

  @Enumerated(EnumType.STRING)
  private TemplateStatus status;

  @ManyToOne
  private Organization organization;
}


