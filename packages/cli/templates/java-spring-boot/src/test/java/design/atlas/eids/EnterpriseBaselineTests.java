package design.atlas.eids;

import static org.assertj.core.api.Assertions.assertThat;

import design.atlas.eids.ai.AICompletion;
import design.atlas.eids.ai.AIProvider;
import design.atlas.eids.ai.AIRequest;
import java.util.List;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EnterpriseBaselineTests {
    @Autowired
    AIProvider provider;

    @Autowired
    Flyway flyway;

    @Autowired
    DataSource dataSource;

    @Test
    void defaultProviderIsOfflineSafeAndDoesNotEchoContextData() {
        AICompletion completion = provider.complete(new AIRequest("生成今日摘要", List.of("customer:AC-1048"), null));
        assertThat(completion.provider()).isEqualTo("demo");
        assertThat(completion.text()).contains("生成今日摘要").doesNotContain("AC-1048");
    }

    @Test
    void flywayOwnsTheValidatedSchema() throws Exception {
        assertThat(flyway.info().current().getVersion().getVersion()).isEqualTo("2");
        try (var connection = dataSource.getConnection();
             var result = connection.getMetaData().getTables(null, null, "ATLAS_AGENT_EXECUTIONS", null)) {
            assertThat(result.next()).isTrue();
        }
        try (var connection = dataSource.getConnection();
             var result = connection.getMetaData().getTables(null, null, "ATLAS_AI_CONVERSATIONS", null)) {
            assertThat(result.next()).isTrue();
        }
    }
}
