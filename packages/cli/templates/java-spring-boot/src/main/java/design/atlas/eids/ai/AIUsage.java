package design.atlas.eids.ai;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "atlas_ai_usage")
public class AIUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String tenantId;
    @Column(nullable = false, length = 120)
    private String actor;
    @Column(nullable = false, length = 80)
    private String requestId;
    @Column(nullable = false, length = 80)
    private String provider;
    @Column(nullable = false, length = 120)
    private String model;
    @Column(nullable = false)
    private int inputTokens;
    @Column(nullable = false)
    private int outputTokens;
    @Column(nullable = false)
    private long estimatedCostMicros;
    @Column(nullable = false)
    private int attempts;
    @Column(nullable = false)
    private long durationMs;
    @Column(nullable = false, length = 40)
    private String outcome;
    @Column(nullable = false)
    private Instant createdAt;

    protected AIUsage() {}

    public AIUsage(String tenantId, String actor, String requestId, AICompletion completion, long durationMs) {
        this.tenantId = tenantId;
        this.actor = actor;
        this.requestId = requestId;
        this.provider = completion.provider();
        this.model = completion.model();
        this.inputTokens = completion.inputTokens();
        this.outputTokens = completion.outputTokens();
        this.estimatedCostMicros = completion.estimatedCostMicros();
        this.attempts = completion.attempts();
        this.durationMs = durationMs;
        this.outcome = "COMPLETED";
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getActor() { return actor; }
    public String getRequestId() { return requestId; }
    public String getProvider() { return provider; }
    public String getModel() { return model; }
    public int getInputTokens() { return inputTokens; }
    public int getOutputTokens() { return outputTokens; }
    public long getEstimatedCostMicros() { return estimatedCostMicros; }
    public int getAttempts() { return attempts; }
    public long getDurationMs() { return durationMs; }
    public String getOutcome() { return outcome; }
    public Instant getCreatedAt() { return createdAt; }
}
