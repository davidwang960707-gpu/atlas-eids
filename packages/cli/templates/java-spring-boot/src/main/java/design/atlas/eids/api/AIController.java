package design.atlas.eids.api;

import design.atlas.eids.ai.AICompletion;
import design.atlas.eids.ai.AIConversationService;
import design.atlas.eids.ai.AIProvider;
import design.atlas.eids.ai.AIRequest;
import design.atlas.eids.ai.AIUsageService;
import design.atlas.eids.audit.AuditService;
import design.atlas.eids.tenant.TenantContext;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {
    public record ChatRequest(
        @NotBlank String message,
        List<String> contexts,
        String model,
        String conversationId,
        List<String> attachmentIds
    ) {}

    private final AuditService auditService;
    private final AIProvider provider;
    private final AIConversationService conversationService;
    private final AIUsageService usageService;

    public AIController(
        AuditService auditService,
        AIProvider provider,
        AIConversationService conversationService,
        AIUsageService usageService
    ) {
        this.auditService = auditService;
        this.provider = provider;
        this.conversationService = conversationService;
        this.usageService = usageService;
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@Valid @RequestBody ChatRequest request) {
        SseEmitter emitter = new SseEmitter(30_000L);
        String tenantId = TenantContext.require();
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        String requestId = UUID.randomUUID().toString();
        String conversationId = conversationService.appendUser(
            tenantId, actor, request.conversationId(), request.message(), request.contexts(), request.attachmentIds()
        );
        auditService.record(
            "ai.chat.requested",
            "ai-conversation",
            requestId,
            "ACCEPTED",
            Map.of(
                "messageLength", request.message().length(),
                "model", request.model() == null ? "default" : request.model(),
                "provider", provider.id()
            )
        );
        CompletableFuture.runAsync(() -> complete(request, tenantId, actor, requestId, conversationId, emitter));
        return emitter;
    }

    private void complete(ChatRequest request, String tenantId, String actor, String requestId, String conversationId, SseEmitter emitter) {
        long startedAt = System.nanoTime();
        try {
            emitter.send(SseEmitter.event().name("start").data(Map.of(
                "requestId", requestId, "conversationId", conversationId, "tenant", tenantId,
                "provider", provider.id(), "time", Instant.now().toString()
            )));
            AICompletion completion = provider.complete(new AIRequest(request.message(), request.contexts(), request.model()));
            conversationService.appendAssistant(tenantId, conversationId, completion);
            usageService.record(tenantId, actor, requestId, completion, (System.nanoTime() - startedAt) / 1_000_000);
            for (int offset = 0; offset < completion.text().length(); offset += 32) {
                String delta = completion.text().substring(offset, Math.min(offset + 32, completion.text().length()));
                emitter.send(SseEmitter.event().name("text-delta").data(Map.of("delta", delta)));
            }
            emitter.send(SseEmitter.event().name("finish").data(Map.of(
                "reason", "stop", "model", completion.model(), "provider", completion.provider(),
                "inputTokens", completion.inputTokens(), "outputTokens", completion.outputTokens(),
                "estimatedCostMicros", completion.estimatedCostMicros(), "attempts", completion.attempts()
            )));
            emitter.complete();
        } catch (Exception error) {
            try {
                emitter.send(SseEmitter.event().name("error").data(Map.of(
                    "code", "provider_error", "message", "AI provider request failed"
                )));
            } catch (Exception ignored) {
                // The client may already have closed the stream.
            }
            emitter.completeWithError(error);
        }
    }
}
