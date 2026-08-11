package design.atlas.eids.ai;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AIConversationService {
    public record ConversationDetail(AIConversation conversation, List<AIMessage> messages, List<AIAttachment> attachments) {}

    private final AIConversationRepository conversations;
    private final AIMessageRepository messages;
    private final AIAttachmentRepository attachments;
    private final ObjectMapper objectMapper;

    public AIConversationService(AIConversationRepository conversations, AIMessageRepository messages, AIAttachmentRepository attachments, ObjectMapper objectMapper) {
        this.conversations = conversations;
        this.messages = messages;
        this.attachments = attachments;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public String appendUser(String tenantId, String actor, String conversationId, String content, List<String> contexts, List<String> attachmentIds) {
        Instant now = Instant.now();
        AIConversation conversation = conversationId == null || conversationId.isBlank()
            ? conversations.save(new AIConversation(UUID.randomUUID().toString(), tenantId, actor, title(content), now))
            : requireConversation(conversationId, tenantId);
        conversation.touch(now);
        messages.save(new AIMessage(
            UUID.randomUUID().toString(), conversation.getId(), tenantId, "user", content,
            json(Map.of("contexts", contexts == null ? List.of() : contexts, "attachmentIds", attachmentIds == null ? List.of() : attachmentIds)), now
        ));
        return conversation.getId();
    }

    @Transactional
    public void appendAssistant(String tenantId, String conversationId, AICompletion completion) {
        AIConversation conversation = requireConversation(conversationId, tenantId);
        Instant now = Instant.now();
        conversation.touch(now);
        messages.save(new AIMessage(
            UUID.randomUUID().toString(), conversationId, tenantId, "assistant", completion.text(),
            json(Map.of("provider", completion.provider(), "model", completion.model(), "inputTokens", completion.inputTokens(), "outputTokens", completion.outputTokens())), now
        ));
    }

    @Transactional
    public AIAttachment addAttachment(String tenantId, String conversationId, String fileName, String mediaType, String storageKey, long sizeBytes) {
        requireConversation(conversationId, tenantId);
        return attachments.save(new AIAttachment(UUID.randomUUID().toString(), conversationId, tenantId, fileName, mediaType, storageKey, sizeBytes, Instant.now()));
    }

    @Transactional(readOnly = true)
    public List<AIConversation> list(String tenantId) {
        return conversations.findTop50ByTenantIdOrderByUpdatedAtDesc(tenantId);
    }

    @Transactional(readOnly = true)
    public ConversationDetail get(String tenantId, String conversationId) {
        return new ConversationDetail(
            requireConversation(conversationId, tenantId),
            messages.findByTenantIdAndConversationIdOrderByCreatedAt(tenantId, conversationId),
            attachments.findByTenantIdAndConversationIdOrderByCreatedAt(tenantId, conversationId)
        );
    }

    private AIConversation requireConversation(String id, String tenantId) {
        return conversations.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AI conversation not found"));
    }

    private String title(String content) {
        String normalized = content.strip().replaceAll("\\s+", " ");
        return normalized.substring(0, Math.min(normalized.length(), 80));
    }

    private String json(Map<String, Object> value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JacksonException error) {
            return "{}";
        }
    }
}
