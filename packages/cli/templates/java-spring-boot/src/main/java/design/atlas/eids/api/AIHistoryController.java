package design.atlas.eids.api;

import design.atlas.eids.ai.AIAttachment;
import design.atlas.eids.ai.AIConversation;
import design.atlas.eids.ai.AIConversationService;
import design.atlas.eids.ai.AIUsage;
import design.atlas.eids.ai.AIUsageService;
import design.atlas.eids.tenant.TenantContext;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
public class AIHistoryController {
    public record AttachmentRequest(
        @NotBlank String fileName,
        @NotBlank String mediaType,
        @NotBlank String storageKey,
        @Min(0) long sizeBytes
    ) {}

    private final AIConversationService conversations;
    private final AIUsageService usage;

    public AIHistoryController(AIConversationService conversations, AIUsageService usage) {
        this.conversations = conversations;
        this.usage = usage;
    }

    @GetMapping("/conversations")
    public List<AIConversation> conversations() {
        return conversations.list(TenantContext.require());
    }

    @GetMapping("/conversations/{id}")
    public AIConversationService.ConversationDetail conversation(@PathVariable String id) {
        return conversations.get(TenantContext.require(), id);
    }

    @PostMapping("/conversations/{id}/attachments")
    @ResponseStatus(HttpStatus.CREATED)
    public AIAttachment attachment(@PathVariable String id, @Valid @RequestBody AttachmentRequest request) {
        return conversations.addAttachment(
            TenantContext.require(), id, request.fileName(), request.mediaType(), request.storageKey(), request.sizeBytes()
        );
    }

    @GetMapping("/usage")
    public List<AIUsage> usage() {
        return usage.list(TenantContext.require());
    }
}
