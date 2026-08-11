package design.atlas.eids;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.time.Instant;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiSecurityTests {
    private static final Pattern TOKEN_PATTERN = Pattern.compile("\\\"accessToken\\\":\\\"([^\\\"]+)\\\"");
    private static final Pattern ID_PATTERN = Pattern.compile("\\\"id\\\":\\\"([^\\\"]+)\\\"");

    @Autowired
    MockMvc mvc;

    @Autowired
    JwtEncoder jwtEncoder;

    @Test
    void healthIsPublicButToolsRequireAuthentication() throws Exception {
        mvc.perform(get("/api/v1/system/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ok"));

        mvc.perform(get("/api/v1/agent/tools"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenAndTenantContextSupportAnAuthorizedRequest() throws Exception {
        String token = token("admin", "atlas-cn");

        mvc.perform(get("/api/v1/tenant/current")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.tenant").value("atlas-cn"))
            .andExpect(jsonPath("$.actor").value("admin"));
    }

    @Test
    void missingAndUnauthorizedTenantAreRejected() throws Exception {
        String token = token("analyst", "atlas-cn");

        mvc.perform(get("/api/v1/agent/tools")
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("missing_tenant"));

        mvc.perform(get("/api/v1/agent/tools")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "east-retail"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.code").value("tenant_forbidden"));
    }

    @Test
    void highRiskToolRequiresPersistedApprovalAndSupportsTenantScopedReplay() throws Exception {
        String token = token("admin", "atlas-cn");

        String executionBody = mvc.perform(post("/api/v1/agent/tools/execute")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "atlas-cn")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"records.publish\",\"input\":{\"recordId\":\"AC-1048\"},\"approved\":true}"))
            .andExpect(status().isAccepted())
            .andExpect(header().exists("X-Request-Id"))
            .andExpect(jsonPath("$.status").value("approval-required"))
            .andReturn()
            .getResponse()
            .getContentAsString();
        String executionId = executionId(executionBody);
        String analystToken = token("analyst", "atlas-cn");

        mvc.perform(post("/api/v1/agent/executions/" + executionId + "/approve")
                .header(HttpHeaders.AUTHORIZATION, bearer(analystToken))
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isForbidden());

        mvc.perform(get("/api/v1/audit/events")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].tenantId").value("atlas-cn"))
            .andExpect(jsonPath("$[0].outcome").value("APPROVAL_REQUIRED"))
            .andExpect(jsonPath("$[0].correlationId").isNotEmpty());

        mvc.perform(post("/api/v1/agent/executions/" + executionId + "/approve")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("completed"))
            .andExpect(jsonPath("$.approvedBy").value("admin"));

        mvc.perform(get("/api/v1/agent/executions/" + executionId + "/replay")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.result.recordId").value("AC-1048"));

        mvc.perform(get("/api/v1/agent/executions/" + executionId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "east-retail"))
            .andExpect(status().isNotFound());
    }

    @Test
    void auditEndpointRequiresAdministratorRole() throws Exception {
        String token = token("analyst", "atlas-cn");

        mvc.perform(get("/api/v1/audit/events")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isForbidden());
    }

    @Test
    void expiredTokensAreRejectedBeforeTenantResolution() throws Exception {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("atlas-eids-local")
            .subject("analyst")
            .issuedAt(now.minusSeconds(120))
            .expiresAt(now.minusSeconds(60))
            .claim("roles", java.util.List.of("USER"))
            .claim("tenants", java.util.List.of("atlas-cn"))
            .build();
        String expired = jwtEncoder.encode(JwtEncoderParameters.from(
            JwsHeader.with(MacAlgorithm.HS256).build(), claims
        )).getTokenValue();

        mvc.perform(get("/api/v1/tenant/current")
                .header(HttpHeaders.AUTHORIZATION, bearer(expired))
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isUnauthorized());
    }

    private String token(String username, String tenant) throws Exception {
        String body = mvc.perform(post("/api/v1/auth/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + username + "\",\"password\":\"atlas-local-only\",\"tenant\":\"" + tenant + "\"}"))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
        Matcher matcher = TOKEN_PATTERN.matcher(body);
        if (!matcher.find()) {
            throw new IllegalStateException("Access token missing from response");
        }
        return matcher.group(1);
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private String executionId(String body) {
        Matcher matcher = ID_PATTERN.matcher(body);
        if (!matcher.find()) {
            throw new IllegalStateException("Agent execution id missing from response");
        }
        return matcher.group(1);
    }
}
