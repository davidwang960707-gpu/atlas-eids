package design.atlas.eids.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
@ConditionalOnProperty(name = "atlas.security.mode", havingValue = "local", matchIfMissing = true)
public class AuthController {
    public record TokenRequest(@NotBlank String username, @NotBlank String password, @NotBlank String tenant) {}
    public record TokenResponse(String accessToken, String tokenType, long expiresIn, String tenant, List<String> tenants) {}

    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final String issuer;
    private final Duration tokenTtl;

    public AuthController(
        AuthenticationManager authenticationManager,
        JwtEncoder jwtEncoder,
        @Value("${atlas.security.issuer}") String issuer,
        @Value("${atlas.security.token-ttl}") Duration tokenTtl
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
        this.issuer = issuer;
        this.tokenTtl = tokenTtl;
    }

    @PostMapping("/token")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse token(@Valid @RequestBody TokenRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken.unauthenticated(request.username(), request.password())
        );
        List<String> tenants = allowedTenants(authentication.getName());
        if (!tenants.contains(request.tenant())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "The account cannot access this tenant");
        }

        Instant issuedAt = Instant.now();
        List<String> roles = authentication.getAuthorities().stream()
            .filter(authority -> authority.getAuthority().startsWith("ROLE_"))
            .map(authority -> authority.getAuthority().replaceFirst("^ROLE_", ""))
            .toList();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer(issuer)
            .issuedAt(issuedAt)
            .expiresAt(issuedAt.plus(tokenTtl))
            .subject(authentication.getName())
            .claim("roles", roles)
            .claim("tenants", tenants)
            .claim("active_tenant", request.tenant())
            .build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(
            JwsHeader.with(MacAlgorithm.HS256).build(),
            claims
        )).getTokenValue();

        return new TokenResponse(token, "Bearer", tokenTtl.toSeconds(), request.tenant(), tenants);
    }

    private List<String> allowedTenants(String username) {
        if ("admin".equals(username)) {
            return List.of("atlas-cn", "east-retail", "south-sales");
        }
        return List.of("atlas-cn");
    }
}
