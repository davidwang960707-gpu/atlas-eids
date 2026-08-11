package design.atlas.eids;

import static org.assertj.core.api.Assertions.assertThat;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import design.atlas.eids.api.AuthController;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPublicKey;
import java.util.Arrays;
import java.util.Base64;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest(properties = {
    "atlas.security.mode=oidc",
    "spring.datasource.url=jdbc:h2:mem:atlas-oidc;MODE=PostgreSQL;DB_CLOSE_DELAY=-1"
})
class OidcModeTests {
    private static final HttpServer ISSUER = startIssuer();
    private static final String ISSUER_URL = "http://127.0.0.1:" + ISSUER.getAddress().getPort();

    @Autowired
    ApplicationContext context;

    @DynamicPropertySource
    static void oidcProperties(DynamicPropertyRegistry registry) {
        registry.add("atlas.security.oidc-issuer-uri", () -> ISSUER_URL);
    }

    @AfterAll
    static void stopIssuer() {
        ISSUER.stop(0);
    }

    @Test
    void oidcModeDisablesLocalTokenIssuingAndUsesExternalDecoder() {
        assertThat(context.getBeansOfType(AuthController.class)).isEmpty();
        assertThat(context.getBeansOfType(JwtEncoder.class)).isEmpty();
        assertThat(context.getBeansOfType(JwtDecoder.class)).hasSize(1);
    }

    private static HttpServer startIssuer() {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            RSAPublicKey publicKey = (RSAPublicKey) generator.generateKeyPair().getPublic();
            byte[] modulus = publicKey.getModulus().toByteArray();
            if (modulus[0] == 0) modulus = Arrays.copyOfRange(modulus, 1, modulus.length);
            String encodedModulus = Base64.getUrlEncoder().withoutPadding().encodeToString(modulus);
            server.createContext("/.well-known/openid-configuration", exchange -> respond(exchange, """
                {"issuer":"%s","jwks_uri":"%s/jwks","authorization_endpoint":"%s/authorize","token_endpoint":"%s/token"}
                """.formatted(
                    "http://127.0.0.1:" + server.getAddress().getPort(),
                    "http://127.0.0.1:" + server.getAddress().getPort(),
                    "http://127.0.0.1:" + server.getAddress().getPort(),
                    "http://127.0.0.1:" + server.getAddress().getPort()
                )));
            server.createContext("/jwks", exchange -> respond(exchange, """
                {"keys":[{"kty":"RSA","use":"sig","alg":"RS256","kid":"atlas-test","n":"%s","e":"AQAB"}]}
                """.formatted(encodedModulus)));
            server.start();
            return server;
        } catch (Exception error) {
            throw new ExceptionInInitializerError(error);
        }
    }

    private static void respond(HttpExchange exchange, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }
}
