package design.atlas.eids.ai;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIConversationRepository extends JpaRepository<AIConversation, String> {
    Optional<AIConversation> findByIdAndTenantId(String id, String tenantId);
    List<AIConversation> findTop50ByTenantIdOrderByUpdatedAtDesc(String tenantId);
}
