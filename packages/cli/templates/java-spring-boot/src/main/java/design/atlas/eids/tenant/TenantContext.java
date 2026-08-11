package design.atlas.eids.tenant;

public final class TenantContext {
    private static final ThreadLocal<String> CURRENT = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(String tenantId) {
        CURRENT.set(tenantId);
    }

    public static String require() {
        String tenantId = CURRENT.get();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context is not available");
        }
        return tenantId;
    }

    public static void clear() {
        CURRENT.remove();
    }
}
