package design.atlas.eids.tenant;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class TenantFilter extends OncePerRequestFilter {
    public static final String TENANT_HEADER = "X-Atlas-Tenant";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.equals("/api/v1/auth/token")
            || path.equals("/api/v1/system/health")
            || path.startsWith("/actuator/health");
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            filterChain.doFilter(request, response);
            return;
        }

        String tenantId = request.getHeader(TENANT_HEADER);
        if (tenantId == null || tenantId.isBlank()) {
            writeError(response, HttpStatus.BAD_REQUEST, "missing_tenant", "X-Atlas-Tenant is required");
            return;
        }
        List<String> allowedTenants = jwtAuthentication.getToken().getClaimAsStringList("tenants");
        if (allowedTenants == null || !allowedTenants.contains(tenantId)) {
            writeError(response, HttpStatus.FORBIDDEN, "tenant_forbidden", "Token cannot access this tenant");
            return;
        }

        try {
            TenantContext.set(tenantId);
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private void writeError(HttpServletResponse response, HttpStatus status, String code, String message) throws IOException {
        response.setStatus(status.value());
        response.setHeader(HttpHeaders.CONTENT_TYPE, "application/json");
        response.getWriter().printf("{\"code\":\"%s\",\"message\":\"%s\"}", code, message);
    }
}
