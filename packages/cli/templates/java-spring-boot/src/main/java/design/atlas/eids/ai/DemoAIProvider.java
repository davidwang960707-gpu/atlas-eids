package design.atlas.eids.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "atlas.ai.provider", havingValue = "demo", matchIfMissing = true)
public class DemoAIProvider implements AIProvider {
    @Override
    public AICompletion complete(AIRequest request) {
        String model = request.model() == null || request.model().isBlank() ? "atlas-demo" : request.model();
        return new AICompletion("Atlas Java backend received: " + request.message(), model, id());
    }

    @Override
    public String id() {
        return "demo";
    }
}
