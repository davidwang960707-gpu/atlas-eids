package design.atlas.eids.ai;

public record AICompletion(
    String text,
    String model,
    String provider,
    int inputTokens,
    int outputTokens,
    long estimatedCostMicros,
    int attempts
) {
    public AICompletion(String text, String model, String provider) {
        this(text, model, provider, 0, 0, 0, 1);
    }
}
