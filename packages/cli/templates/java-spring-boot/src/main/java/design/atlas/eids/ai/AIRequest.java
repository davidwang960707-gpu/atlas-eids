package design.atlas.eids.ai;

import java.util.List;

public record AIRequest(String message, List<String> contexts, String model) {}
