package design.atlas.eids;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.MountableFile;

@SpringBootTest(properties = {
    "atlas.security.mode=oidc",
    "spring.datasource.url=jdbc:h2:mem:atlas-keycloak;MODE=PostgreSQL;DB_CLOSE_DELAY=-1"
})
@AutoConfigureMockMvc
@Testcontainers(disabledWithoutDocker = true)
@Tag("integration")
class KeycloakOidcContainerTests {
    private static final Pattern TOKEN = Pattern.compile("\\\"access_token\\\":\\\"([^\\\"]+)\\\"");

    @Container
    static final GenericContainer<?> KEYCLOAK = new GenericContainer<>("quay.io/keycloak/keycloak:26.7.0")
        .withEnv("KC_BOOTSTRAP_ADMIN_USERNAME", "admin")
        .withEnv("KC_BOOTSTRAP_ADMIN_PASSWORD", "atlas-test-only")
        .withCopyFileToContainer(
            MountableFile.forClasspathResource("keycloak/atlas-eids-realm.json"),
            "/opt/keycloak/data/import/atlas-eids-realm.json"
        )
        .withCommand("start-dev", "--import-realm", "--hostname-strict=false")
        .withExposedPorts(8080)
        .waitingFor(Wait.forHttp("/realms/atlas-eids/.well-known/openid-configuration").forStatusCode(200).withStartupTimeout(Duration.ofMinutes(3)));

    @Autowired
    MockMvc mvc;

    @DynamicPropertySource
    static void oidcProperties(DynamicPropertyRegistry registry) {
        registry.add("atlas.security.oidc-issuer-uri", () -> issuer());
    }

    @Test
    void realOidcClaimsDriveRbacAndTenantIsolation() throws Exception {
        String admin = token("admin");
        mvc.perform(get("/api/v1/tenant/current")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + admin)
                .header("X-Atlas-Tenant", "east-retail"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.tenant").value("east-retail"));

        String analyst = token("analyst");
        mvc.perform(get("/api/v1/audit/events")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + analyst)
                .header("X-Atlas-Tenant", "atlas-cn"))
            .andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/tenant/current")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + analyst)
                .header("X-Atlas-Tenant", "east-retail"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.code").value("tenant_forbidden"));
    }

    private String token(String username) throws Exception {
        String form = "grant_type=password&client_id=atlas-cli&username=" + encode(username)
            + "&password=" + encode("atlas-local-only");
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(issuer() + "/protocol/openid-connect/token"))
            .header("content-type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(form))
            .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new IllegalStateException("Keycloak token request failed: " + response.body());
        Matcher matcher = TOKEN.matcher(response.body());
        if (!matcher.find()) throw new IllegalStateException("Keycloak access token missing");
        return matcher.group(1);
    }

    private static String issuer() {
        return "http://" + KEYCLOAK.getHost() + ":" + KEYCLOAK.getMappedPort(8080) + "/realms/atlas-eids";
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
