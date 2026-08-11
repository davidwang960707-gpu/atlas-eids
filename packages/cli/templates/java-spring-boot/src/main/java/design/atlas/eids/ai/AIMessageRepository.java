package design.atlas.eids.ai;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIMessageRepository extends JpaRepository<AIMessage, String> {
    List<AIMessage> findByTenantIdAndConversationIdOrderByCreatedAt(String tenantId, String conversationId);
}
