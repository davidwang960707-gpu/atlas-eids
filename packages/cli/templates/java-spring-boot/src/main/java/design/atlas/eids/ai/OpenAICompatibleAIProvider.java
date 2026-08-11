package design.atlas.eids.ai;

import tools.jackson.databind.JsonNode;
import java.net.http.HttpClient;
import java.net.http.HttpTimeoutException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Component
@ConditionalOnProperty(name = "atlas.ai.provider", havingValue = "openai-compatible")
public class OpenAICompatibleAIProvider implements AIProvider {
    private final RestClient client;
    private final String apiKey;
    private final String defaultModel;
    private final int maxAttempts;
    private final Duration retryDelay;
    private final double inputCostPerMillion;
    private final double outputCostPerMillion;
    private final int requestsPerMinute;
    private final AtomicLong windowStartedAt = new AtomicLong(System.currentTimeMillis());
    private final AtomicInteger requestsInWindow = new AtomicInteger();

    public OpenAICompatibleAIProvider(
        RestClient.Builder builder,
        @Value("${atlas.ai.base-url}") String baseUrl,
        @Value("${atlas.ai.api-key}") String apiKey,
        @Value("${atlas.ai.model}") String defaultModel,
        @Value("${atlas.ai.timeout}") Duration timeout,
        @Value("${atlas.ai.max-attempts}") int maxAttempts,
        @Value("${atlas.ai.retry-delay}") Duration retryDelay,
        @Value("${atlas.ai.requests-per-minute}") int requestsPerMinute,
        @Value("${atlas.ai.input-cost-per-million}") double inputCostPerMillion,
        @Value("${atlas.ai.output-cost-per-million}") double outputCostPerMillion
    ) {
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(
            HttpClient.newBuilder().connectTimeout(timeout).build()
        );
        requestFactory.setReadTimeout(timeout);
        this.client = builder.baseUrl(baseUrl.replaceAll("/+$", "")).requestFactory(requestFactory).build();
        this.apiKey = apiKey;
        this.defaultModel = defaultModel;
        this.maxAttempts = Math.max(1, maxAttempts);
        this.retryDelay = retryDelay;
        this.requestsPerMinute = Math.max(1, requestsPerMinute);
        this.inputCostPerMillion = inputCostPerMillion;
        this.outputCostPerMillion = outputCostPerMillion;
    }

    @Override
    public AICompletion complete(AIRequest request) {
        if (apiKey.isBlank()) {
            throw new IllegalStateException("ATLAS_AI_API_KEY is required for openai-compatible provider");
        }
        acquireRateLimit();
        String model = request.model() == null || request.model().isBlank() ? defaultModel : request.model();
        JsonNode response = null;
        int attempts = 0;
        RestClientException finalError = null;
        while (attempts < maxAttempts) {
            attempts += 1;
            try {
                response = client.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .body(Map.of(
                        "model", model,
                        "messages", List.of(Map.of("role", "user", "content", request.message())),
                        "stream", false
                    ))
                    .retrieve()
                    .body(JsonNode.class);
                finalError = null;
                break;
            } catch (RestClientException error) {
                finalError = error;
                if (attempts >= maxAttempts || !retryable(error)) break;
                sleep(attempts);
            }
        }
        if (finalError != null) {
            if (hasCause(finalError, HttpTimeoutException.class)) {
                throw new IllegalStateException("AI provider request timed out", finalError);
            }
            throw finalError;
        }
        JsonNode content = response == null ? null : response.path("choices").path(0).path("message").path("content");
        String text = content == null || content.isMissingNode() || content.isNull() ? "" : content.stringValue("");
        if (text.isBlank()) throw new IllegalStateException("AI provider returned an empty completion");
        int inputTokens = response.path("usage").path("prompt_tokens").asInt(0);
        int outputTokens = response.path("usage").path("completion_tokens").asInt(0);
        long estimatedCostMicros = Math.round(
            inputTokens * inputCostPerMillion + outputTokens * outputCostPerMillion
        );
        return new AICompletion(text, model, id(), inputTokens, outputTokens, estimatedCostMicros, attempts);
    }

    @Override
    public String id() {
        return "openai-compatible";
    }

    private void acquireRateLimit() {
        long now = System.currentTimeMillis();
        long startedAt = windowStartedAt.get();
        if (now - startedAt >= 60_000 && windowStartedAt.compareAndSet(startedAt, now)) {
            requestsInWindow.set(0);
        }
        if (requestsInWindow.incrementAndGet() > requestsPerMinute) {
            requestsInWindow.decrementAndGet();
            throw new IllegalStateException("AI provider rate limit exceeded");
        }
    }

    private boolean retryable(RestClientException error) {
        if (error instanceof RestClientResponseException responseError) {
            int status = responseError.getStatusCode().value();
            return status == 408 || status == 429 || status >= 500;
        }
        return true;
    }

    private void sleep(int attempt) {
        try {
            Thread.sleep(retryDelay.multipliedBy(attempt).toMillis());
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("AI provider retry interrupted", error);
        }
    }

    private boolean hasCause(Throwable error, Class<? extends Throwable> type) {
        Throwable current = error;
        while (current != null) {
            if (type.isInstance(current)) return true;
            current = current.getCause();
        }
        return false;
    }
}
