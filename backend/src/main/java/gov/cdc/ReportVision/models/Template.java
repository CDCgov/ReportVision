package gov.cdc.ReportVision.models;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class Template {

  @Id
  @GeneratedValue(generator = "UUID4")
  @Column(updatable = false, nullable = false)
  private UUID id;


  public String name;
  public String description;
  public String labName;
}
