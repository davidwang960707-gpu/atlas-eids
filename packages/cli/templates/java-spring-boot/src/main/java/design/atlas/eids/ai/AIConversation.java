package design.atlas.eids.ai;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "atlas_ai_conversations")
public class AIConversation {
    @Id
    @Column(length = 36)
    private String id;
    @Column(nullable = false, length = 80)
    private String tenantId;
    @Column(nullable = false, length = 120)
    private String actor;
    @Column(nullable = false, length = 240)
    private String title;
    @Column(nullable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    protected AIConversation() {}

    public AIConversation(String id, String tenantId, String actor, String title, Instant now) {
        this.id = id;
        this.tenantId = tenantId;
        this.actor = actor;
        this.title = title;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void touch(Instant now) { updatedAt = now; }
    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getActor() { return actor; }
    public String getTitle() { return title; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
