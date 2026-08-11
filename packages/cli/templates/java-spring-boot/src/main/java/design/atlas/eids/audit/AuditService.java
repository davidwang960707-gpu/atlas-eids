package design.atlas.eids.audit;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import design.atlas.eids.context.RequestContext;
import design.atlas.eids.tenant.TenantContext;
import java.time.Instant;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditEventRepository repository;
    private final ObjectMapper objectMapper;

    public AuditService(AuditEventRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public void record(
        String action,
        String resourceType,
        String resourceId,
        String outcome,
        Map<String, Object> metadata
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String actor = authentication == null ? "system" : authentication.getName();
        repository.save(new AuditEvent(
            TenantContext.require(),
            actor,
            action,
            resourceType,
            resourceId,
            outcome,
            toJson(metadata),
            RequestContext.correlationId(),
            Instant.now()
        ));
    }

    private String toJson(Map<String, Object> metadata) {
        try {
            return objectMapper.writeValueAsString(metadata);
        } catch (JacksonException error) {
            return "{\"serializationError\":true}";
        }
    }
}
