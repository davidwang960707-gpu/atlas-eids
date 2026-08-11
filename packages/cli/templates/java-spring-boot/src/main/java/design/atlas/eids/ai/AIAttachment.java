package design.atlas.eids.ai;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "atlas_ai_attachments")
public class AIAttachment {
    @Id
    @Column(length = 36)
    private String id;
    @Column(nullable = false, length = 36)
    private String conversationId;
    @Column(nullable = false, length = 80)
    private String tenantId;
    @Column(nullable = false, length = 240)
    private String fileName;
    @Column(nullable = false, length = 120)
    private String mediaType;
    @Column(nullable = false, length = 500)
    private String storageKey;
    @Column(nullable = false)
    private long sizeBytes;
    @Column(nullable = false)
    private Instant createdAt;

    protected AIAttachment() {}

    public AIAttachment(String id, String conversationId, String tenantId, String fileName, String mediaType, String storageKey, long sizeBytes, Instant createdAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.tenantId = tenantId;
        this.fileName = fileName;
        this.mediaType = mediaType;
        this.storageKey = storageKey;
        this.sizeBytes = sizeBytes;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getConversationId() { return conversationId; }
    public String getTenantId() { return tenantId; }
    public String getFileName() { return fileName; }
    public String getMediaType() { return mediaType; }
    public String getStorageKey() { return storageKey; }
    public long getSizeBytes() { return sizeBytes; }
    public Instant getCreatedAt() { return createdAt; }
}
