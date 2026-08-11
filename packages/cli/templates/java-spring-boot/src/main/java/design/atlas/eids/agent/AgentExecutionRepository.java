package design.atlas.eids.agent;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentExecutionRepository extends JpaRepository<AgentExecution, String> {
    Optional<AgentExecution> findByIdAndTenantId(String id, String tenantId);

    List<AgentExecution> findTop50ByTenantIdOrderByCreatedAtDesc(String tenantId);
}
