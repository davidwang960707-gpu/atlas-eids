package design.atlas.eids.ai;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIUsageRepository extends JpaRepository<AIUsage, Long> {
    List<AIUsage> findTop100ByTenantIdOrderByCreatedAtDesc(String tenantId);
}
