package design.atlas.eids.ai;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AIUsageService {
    private final AIUsageRepository repository;

    public AIUsageService(AIUsageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public AIUsage record(String tenantId, String actor, String requestId, AICompletion completion, long durationMs) {
        return repository.save(new AIUsage(tenantId, actor, requestId, completion, durationMs));
    }

    @Transactional(readOnly = true)
    public List<AIUsage> list(String tenantId) {
        return repository.findTop100ByTenantIdOrderByCreatedAtDesc(tenantId);
    }
}
