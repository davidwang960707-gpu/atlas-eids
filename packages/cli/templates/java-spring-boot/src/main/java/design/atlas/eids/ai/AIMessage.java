package design.atlas.eids.ai;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "atlas_ai_messages")
public class AIMessage {
    @Id
    @Column(length = 36)
    private String id;
    @Column(nullable = false, length = 36)
    private String conversationId;
    @Column(nullable = false, length = 80)
    private String tenantId;
    @Column(nullable = false, length = 40)
    private String role;
    @Column(nullable = false, length = 12000)
    private String content;
    @Column(nullable = false, length = 4000)
    private String metadata;
    @Column(nullable = false)
    private Instant createdAt;

    protected AIMessage() {}

    public AIMessage(String id, String conversationId, String tenantId, String role, String content, String metadata, Instant createdAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.tenantId = tenantId;
        this.role = role;
        this.content = content;
        this.metadata = metadata;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getConversationId() { return conversationId; }
    public String getTenantId() { return tenantId; }
    public String getRole() { return role; }
    public String getContent() { return content; }
    public String getMetadata() { return metadata; }
    public Instant getCreatedAt() { return createdAt; }
}
