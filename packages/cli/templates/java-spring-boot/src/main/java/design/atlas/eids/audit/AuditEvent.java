package design.atlas.eids.audit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "atlas_audit_events")
public class AuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String tenantId;

    @Column(nullable = false, length = 120)
    private String actor;

    @Column(nullable = false, length = 120)
    private String action;

    @Column(nullable = false, length = 80)
    private String resourceType;

    @Column(nullable = false, length = 160)
    private String resourceId;

    @Column(nullable = false, length = 40)
    private String outcome;

    @Column(nullable = false, length = 4000)
    private String details;

    @Column(nullable = false, length = 80)
    private String correlationId;

    @Column(nullable = false)
    private Instant createdAt;

    protected AuditEvent() {}

    public AuditEvent(
        String tenantId,
        String actor,
        String action,
        String resourceType,
        String resourceId,
        String outcome,
        String details,
        String correlationId,
        Instant createdAt
    ) {
        this.tenantId = tenantId;
        this.actor = actor;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.outcome = outcome;
        this.details = details;
        this.correlationId = correlationId;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getActor() { return actor; }
    public String getAction() { return action; }
    public String getResourceType() { return resourceType; }
    public String getResourceId() { return resourceId; }
    public String getOutcome() { return outcome; }
    public String getDetails() { return details; }
    public String getCorrelationId() { return correlationId; }
    public Instant getCreatedAt() { return createdAt; }
}
