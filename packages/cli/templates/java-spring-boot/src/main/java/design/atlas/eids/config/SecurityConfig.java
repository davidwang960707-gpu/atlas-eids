package design.atlas.eids.config;

import design.atlas.eids.tenant.TenantFilter;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, TenantFilter tenantFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/v1/auth/token", "/api/v1/system/health", "/actuator/health").permitAll()
                .requestMatchers("/api/v1/audit/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/agent/executions/*/approve", "/api/v1/agent/executions/*/replay").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(resource -> resource.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
            .addFilterAfter(tenantFilter, BearerTokenAuthenticationFilter.class)
            .build();
    }

    @Configuration(proxyBeanMethods = false)
    @ConditionalOnProperty(name = "atlas.security.mode", havingValue = "local", matchIfMissing = true)
    static class LocalIdentityConfiguration {
        @Bean
        UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder,
            @Value("${atlas.security.demo-password}") String demoPassword
        ) {
            return new InMemoryUserDetailsManager(
                User.withUsername("admin").password(passwordEncoder.encode(demoPassword)).roles("ADMIN", "USER").build(),
                User.withUsername("analyst").password(passwordEncoder.encode(demoPassword)).roles("USER").build()
            );
        }

        @Bean
        PasswordEncoder passwordEncoder() {
            return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }

        @Bean
        AuthenticationManager authenticationManager(UserDetailsService users, PasswordEncoder passwordEncoder) {
            DaoAuthenticationProvider provider = new DaoAuthenticationProvider(users);
            provider.setPasswordEncoder(passwordEncoder);
            return new ProviderManager(provider);
        }

        @Bean
        SecretKey jwtSecretKey(@Value("${atlas.security.jwt-secret}") String secret) {
            if (secret.isBlank()) {
                byte[] generated = new byte[32];
                new SecureRandom().nextBytes(generated);
                return new SecretKeySpec(generated, "HmacSHA256");
            }
            if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
                throw new IllegalArgumentException("ATLAS_JWT_SECRET must contain at least 32 bytes");
            }
            return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        }

        @Bean
        JwtEncoder jwtEncoder(SecretKey secretKey) {
            return NimbusJwtEncoder.withSecretKey(secretKey).algorithm(MacAlgorithm.HS256).build();
        }

        @Bean
        JwtDecoder jwtDecoder(SecretKey secretKey, @Value("${atlas.security.issuer}") String issuer) {
            NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKey).macAlgorithm(MacAlgorithm.HS256).build();
            decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuer));
            return decoder;
        }
    }

    @Configuration(proxyBeanMethods = false)
    @ConditionalOnProperty(name = "atlas.security.mode", havingValue = "oidc")
    static class OidcIdentityConfiguration {
        @Bean
        JwtDecoder jwtDecoder(
            @Value("${atlas.security.oidc-issuer-uri}") String issuerUri,
            @Value("${atlas.security.oidc-jwk-set-uri:}") String jwkSetUri
        ) {
            if (issuerUri.isBlank()) {
                throw new IllegalArgumentException("ATLAS_OIDC_ISSUER_URI is required in oidc mode");
            }
            if (jwkSetUri.isBlank()) return JwtDecoders.fromIssuerLocation(issuerUri);
            NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
            decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuerUri));
            return decoder;
        }
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }
}
