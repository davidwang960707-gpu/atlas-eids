package design.atlas.eids.api;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import design.atlas.eids.agent.AgentExecution;
import design.atlas.eids.agent.AgentExecutionService;
import design.atlas.eids.agent.AgentExecutionStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/agent")
public class AgentToolController {
    public record ToolRequest(@NotBlank String name, Map<String, Object> input, boolean approved) {}
    public record ExecutionView(
        String id,
        String status,
        String tool,
        String tenant,
        String actor,
        JsonNode input,
        JsonNode result,
        String approvedBy,
        Instant approvedAt,
        Instant createdAt,
        Instant updatedAt
    ) {}

    private final AgentExecutionService service;
    private final ObjectMapper objectMapper;

    public AgentToolController(AgentExecutionService service, ObjectMapper objectMapper) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/tools")
    public List<AgentExecutionService.ToolDescriptor> tools() {
        return service.tools();
    }

    @PostMapping("/tools/execute")
    public ResponseEntity<ExecutionView> execute(@Valid @RequestBody ToolRequest request) {
        AgentExecution execution = service.request(request.name(), request.input());
        HttpStatus status = execution.getStatus() == AgentExecutionStatus.PENDING_APPROVAL
            ? HttpStatus.ACCEPTED
            : HttpStatus.OK;
        return ResponseEntity.status(status).body(view(execution));
    }

    @GetMapping("/executions")
    public List<ExecutionView> executions() {
        return service.list().stream().map(this::view).toList();
    }

    @GetMapping("/executions/{id}")
    public ExecutionView execution(@PathVariable String id) {
        return view(service.get(id));
    }

    @PostMapping("/executions/{id}/approve")
    public ExecutionView approve(@PathVariable String id) {
        return view(service.approve(id));
    }

    @GetMapping("/executions/{id}/replay")
    public ExecutionView replay(@PathVariable String id) {
        return view(service.replay(id));
    }

    private ExecutionView view(AgentExecution execution) {
        return new ExecutionView(
            execution.getId(),
            execution.getStatus() == AgentExecutionStatus.PENDING_APPROVAL ? "approval-required" : execution.getStatus().name().toLowerCase(),
            execution.getToolName(),
            execution.getTenantId(),
            execution.getActor(),
            readTree(execution.getInputJson()),
            readTree(execution.getResultJson()),
            execution.getApprovedBy(),
            execution.getApprovedAt(),
            execution.getCreatedAt(),
            execution.getUpdatedAt()
        );
    }

    private JsonNode readTree(String value) {
        if (value == null) return null;
        try {
            return objectMapper.readTree(value);
        } catch (JacksonException error) {
            throw new IllegalStateException("Stored agent execution JSON is invalid", error);
        }
    }
}
