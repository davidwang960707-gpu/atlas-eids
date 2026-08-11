package design.atlas.eids;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import design.atlas.eids.ai.AICompletion;
import design.atlas.eids.ai.AIRequest;
import design.atlas.eids.ai.OpenAICompatibleAIProvider;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

class OpenAICompatibleProviderTests {
    private HttpServer server;

    @AfterEach
    void stopServer() {
        if (server != null) server.stop(0);
    }

    @Test
    void retriesTransientFailuresAndCalculatesTokenCost() throws Exception {
        AtomicInteger calls = new AtomicInteger();
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/v1/chat/completions", exchange -> {
            if (calls.incrementAndGet() == 1) respond(exchange, 500, "{\"error\":\"temporary\"}");
            else respond(exchange, 200, """
                {"choices":[{"message":{"content":"Atlas ready"}}],"usage":{"prompt_tokens":80,"completion_tokens":10}}
                """);
        });
        server.start();

        OpenAICompatibleAIProvider provider = provider(Duration.ofSeconds(1), 3, 60, 1.0, 2.0);
        AICompletion completion = provider.complete(new AIRequest("status", List.of(), null));
        assertThat(completion.text()).isEqualTo("Atlas ready");
        assertThat(completion.attempts()).isEqualTo(2);
        assertThat(completion.inputTokens()).isEqualTo(80);
        assertThat(completion.outputTokens()).isEqualTo(10);
        assertThat(completion.estimatedCostMicros()).isEqualTo(100);
    }

    @Test
    void enforcesTimeoutAndRateLimitBeforeSendingUnboundedTraffic() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/v1/chat/completions", exchange -> {
            try {
                Thread.sleep(150);
            } catch (InterruptedException error) {
                Thread.currentThread().interrupt();
            }
            respond(exchange, 200, "{\"choices\":[{\"message\":{\"content\":\"late\"}}]}");
        });
        server.start();

        OpenAICompatibleAIProvider timeoutProvider = provider(Duration.ofMillis(20), 1, 60, 0, 0);
        assertThatThrownBy(() -> timeoutProvider.complete(new AIRequest("timeout", List.of(), null)))
            .hasMessageContaining("timed out");

        OpenAICompatibleAIProvider limitedProvider = provider(Duration.ofSeconds(1), 1, 1, 0, 0);
        assertThatThrownBy(() -> {
            limitedProvider.complete(new AIRequest("first", List.of(), null));
            limitedProvider.complete(new AIRequest("second", List.of(), null));
        }).hasMessageContaining("rate limit");
    }

    private OpenAICompatibleAIProvider provider(Duration timeout, int attempts, int rateLimit, double inputPrice, double outputPrice) {
        return new OpenAICompatibleAIProvider(
            RestClient.builder(),
            "http://127.0.0.1:" + server.getAddress().getPort() + "/v1",
            "test-key",
            "atlas-test",
            timeout,
            attempts,
            Duration.ZERO,
            rateLimit,
            inputPrice,
            outputPrice
        );
    }

    private static void respond(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, bytes.length);
        try (var output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }
}
