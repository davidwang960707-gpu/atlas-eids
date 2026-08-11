package design.atlas.eids.ai;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIAttachmentRepository extends JpaRepository<AIAttachment, String> {
    List<AIAttachment> findByTenantIdAndConversationIdOrderByCreatedAt(String tenantId, String conversationId);
}
