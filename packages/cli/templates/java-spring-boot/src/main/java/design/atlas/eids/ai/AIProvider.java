package design.atlas.eids.ai;

public interface AIProvider {
    AICompletion complete(AIRequest request);

    String id();
}
