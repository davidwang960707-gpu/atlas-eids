package design.atlas.eids;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@Testcontainers(disabledWithoutDocker = true)
@Tag("integration")
class PostgresMigrationContainerTests {
    @Container
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:17-alpine")
        .withDatabaseName("atlas")
        .withUsername("atlas")
        .withPassword("atlas-test-only");

    @Test
    void flywayUpgradeAndDocumentedRollbackRunOnPostgres() throws Exception {
        Flyway flyway = Flyway.configure()
            .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
            .locations("classpath:db/migration")
            .load();
        assertThat(flyway.migrate().migrationsExecuted).isEqualTo(2);
        assertThat(tableExists("atlas_ai_usage")).isTrue();
        assertThat(tableExists("atlas_ai_conversations")).isTrue();

        String rollback;
        try (var stream = getClass().getResourceAsStream("/db/rollback/U2__ai_usage_and_conversations.sql")) {
            if (stream == null) throw new IllegalStateException("Rollback script missing");
            rollback = new String(stream.readAllBytes(), StandardCharsets.UTF_8);
        }
        try (var connection = POSTGRES.createConnection(""); var statement = connection.createStatement()) {
            statement.execute(rollback);
        }
        assertThat(tableExists("atlas_ai_usage")).isFalse();
        assertThat(tableExists("atlas_ai_conversations")).isFalse();
    }

    private boolean tableExists(String table) throws Exception {
        try (var connection = POSTGRES.createConnection("");
             var statement = connection.prepareStatement("select to_regclass(?) is not null")) {
            statement.setString(1, "public." + table);
            try (var result = statement.executeQuery()) {
                result.next();
                return result.getBoolean(1);
            }
        }
    }
}
