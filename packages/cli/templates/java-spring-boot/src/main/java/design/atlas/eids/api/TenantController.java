package design.atlas.eids.api;

import design.atlas.eids.tenant.TenantContext;
import java.util.List;
import java.util.Map;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tenant")
public class TenantController {
    @GetMapping("/current")
    public Map<String, Object> current(JwtAuthenticationToken authentication) {
        List<String> tenants = authentication.getToken().getClaimAsStringList("tenants");
        return Map.of(
            "tenant", TenantContext.require(),
            "availableTenants", tenants == null ? List.of() : tenants,
            "actor", authentication.getName()
        );
    }
}
