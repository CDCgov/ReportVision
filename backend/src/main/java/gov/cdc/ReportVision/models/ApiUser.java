package gov.cdc.ReportVision.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.Getter;

@Getter
@Entity
public class ApiUser extends BaseEntity {

  @Id
  @GeneratedValue(generator = "UUID4")
  @Column(updatable = false, nullable = false)
  private UUID id;

  @JsonProperty private String name;
  @JsonProperty private String email;

  @JsonIgnore private String password; // Should be hashed and salted

  @ManyToOne private Organization organization;
}
