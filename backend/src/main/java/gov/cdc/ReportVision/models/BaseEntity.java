package gov.cdc.ReportVision.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@MappedSuperclass
public abstract class BaseEntity {
  @JsonProperty
  @Temporal(TemporalType.TIMESTAMP)
  @Column(updatable = false)
  @CreatedDate
  private Date createdAt;

  @JsonProperty
  @Temporal(TemporalType.TIMESTAMP)
  @Column(updatable = false)
  @LastModifiedDate
  private Date updatedAt;

  @JsonProperty
  @Fetch(FetchMode.JOIN)
  @ManyToOne
  private ApiUser createdBy;

  @JsonProperty
  @Fetch(FetchMode.JOIN)
  @ManyToOne
  private ApiUser updatedBy;
}
