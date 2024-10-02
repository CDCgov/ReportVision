package gov.cdc.ReportVision.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Template {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;


  public String name;
  public String description;
  public String labName;
}
