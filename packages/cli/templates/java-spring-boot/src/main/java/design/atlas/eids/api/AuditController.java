package design.atlas.eids.api;

import design.atlas.eids.audit.AuditEvent;
import design.atlas.eids.audit.AuditEventRepository;
import design.atlas.eids.tenant.TenantContext;
import java.time.Instant;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditController {
    public record AuditEventView(
        Long id,
        String tenantId,
        String actor,
        String action,
        String resourceType,
        String resourceId,
        String outcome,
        String details,
        String correlationId,
        Instant createdAt
    ) {
        static AuditEventView from(AuditEvent event) {
            return new AuditEventView(
                event.getId(), event.getTenantId(), event.getActor(), event.getAction(),
                event.getResourceType(), event.getResourceId(), event.getOutcome(),
                event.getDetails(), event.getCorrelationId(), event.getCreatedAt()
            );
        }
    }

    private final AuditEventRepository repository;

    public AuditController(AuditEventRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/events")
    public List<AuditEventView> events() {
        return repository.findTop100ByTenantIdOrderByCreatedAtDesc(TenantContext.require())
            .stream()
            .map(AuditEventView::from)
            .toList();
    }
}
