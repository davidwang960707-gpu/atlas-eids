package design.atlas.eids.agent;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import design.atlas.eids.audit.AuditService;
import design.atlas.eids.tenant.TenantContext;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AgentExecutionService {
    public record ToolDescriptor(String name, String permission, String description) {}

    private static final List<ToolDescriptor> TOOLS = List.of(
        new ToolDescriptor("records.read", "read", "读取授权范围内的记录"),
        new ToolDescriptor("records.publish", "high-risk", "发布已确认的记录")
    );

    private final AgentExecutionRepository repository;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public AgentExecutionService(
        AgentExecutionRepository repository,
        AuditService auditService,
        ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    public List<ToolDescriptor> tools() {
        return TOOLS;
    }

    @Transactional
    public AgentExecution request(String name, Map<String, Object> input) {
        ToolDescriptor tool = TOOLS.stream()
            .filter(candidate -> candidate.name().equals(name))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown agent tool"));
        String tenant = TenantContext.require();
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        String inputJson = toJson(input == null ? Map.of() : input);
        boolean highRisk = "high-risk".equals(tool.permission());
        Instant now = Instant.now();
        AgentExecution execution = repository.save(new AgentExecution(
            UUID.randomUUID().toString(),
            tenant,
            actor,
            name,
            highRisk ? AgentExecutionStatus.PENDING_APPROVAL : AgentExecutionStatus.COMPLETED,
            inputJson,
            highRisk ? null : inputJson,
            now
        ));
        auditService.record(
            name,
            "agent-execution",
            execution.getId(),
            highRisk ? "APPROVAL_REQUIRED" : "COMPLETED",
            Map.of("tool", name, "inputSize", inputJson.length())
        );
        return execution;
    }

    @Transactional(readOnly = true)
    public List<AgentExecution> list() {
        return repository.findTop50ByTenantIdOrderByCreatedAtDesc(TenantContext.require());
    }

    @Transactional(readOnly = true)
    public AgentExecution get(String id) {
        return repository.findByIdAndTenantId(id, TenantContext.require())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agent execution not found"));
    }

    @Transactional
    public AgentExecution approve(String id) {
        AgentExecution execution = get(id);
        if (execution.getStatus() != AgentExecutionStatus.PENDING_APPROVAL) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Execution is not waiting for approval");
        }
        String approver = SecurityContextHolder.getContext().getAuthentication().getName();
        execution.approve(approver, execution.getInputJson(), Instant.now());
        auditService.record(
            "agent.execution.approved",
            "agent-execution",
            execution.getId(),
            "COMPLETED",
            Map.of("tool", execution.getToolName(), "approvedBy", approver)
        );
        return execution;
    }

    @Transactional
    public AgentExecution replay(String id) {
        AgentExecution execution = get(id);
        auditService.record(
            "agent.execution.replayed",
            "agent-execution",
            execution.getId(),
            "READ_ONLY",
            Map.of("tool", execution.getToolName(), "status", execution.getStatus().name())
        );
        return execution;
    }

    private String toJson(Map<String, Object> value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JacksonException error) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agent tool input is not serializable");
        }
    }
}
