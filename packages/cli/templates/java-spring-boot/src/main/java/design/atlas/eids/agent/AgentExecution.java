package design.atlas.eids.agent;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "atlas_agent_executions")
public class AgentExecution {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 80)
    private String tenantId;

    @Column(nullable = false, length = 120)
    private String actor;

    @Column(nullable = false, length = 120)
    private String toolName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private AgentExecutionStatus status;

    @Column(nullable = false, length = 4000)
    private String inputJson;

    @Column(length = 4000)
    private String resultJson;

    @Column(length = 120)
    private String approvedBy;

    private Instant approvedAt;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    protected AgentExecution() {}

    public AgentExecution(
        String id,
        String tenantId,
        String actor,
        String toolName,
        AgentExecutionStatus status,
        String inputJson,
        String resultJson,
        Instant createdAt
    ) {
        this.id = id;
        this.tenantId = tenantId;
        this.actor = actor;
        this.toolName = toolName;
        this.status = status;
        this.inputJson = inputJson;
        this.resultJson = resultJson;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    public void approve(String approver, String resultJson, Instant time) {
        if (status != AgentExecutionStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Only pending executions can be approved");
        }
        approvedBy = approver;
        approvedAt = time;
        status = AgentExecutionStatus.COMPLETED;
        this.resultJson = resultJson;
        updatedAt = time;
    }

    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getActor() { return actor; }
    public String getToolName() { return toolName; }
    public AgentExecutionStatus getStatus() { return status; }
    public String getInputJson() { return inputJson; }
    public String getResultJson() { return resultJson; }
    public String getApprovedBy() { return approvedBy; }
    public Instant getApprovedAt() { return approvedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
