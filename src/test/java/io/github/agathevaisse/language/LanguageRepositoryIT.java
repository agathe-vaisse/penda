package io.github.agathevaisse.language;

import io.github.agathevaisse.Credentials;
import io.github.agathevaisse.LexicalaBasicAuthenticator;
import io.github.agathevaisse.TestHttpServer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;

import java.io.IOException;
import java.util.List;

import static io.github.agathevaisse.Filters.contentNegotiationFilter;
import static io.github.agathevaisse.HttpClients.httpClient;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LanguageRepositoryIT {

    public static final Credentials CREDENTIALS = Credentials.of("fakeuser", "fakepassword".toCharArray());

    @RegisterExtension
    TestHttpServer fakeLexicalaServer = TestHttpServer.withRandomPort()
        .withHandler(
            new LexicalaLanguageFakeApi(
                new Language("fr", "French"),
                new Language("en", "English")),
            new LexicalaBasicAuthenticator(CREDENTIALS),
            contentNegotiationFilter(
                "*/*", "application/*", "application/json"));

    @Test
    void fetches_available_languages() {
        LanguageRepository repository = new LanguageRepository(fakeLexicalaServer.getAddress(), httpClient(CREDENTIALS));

        List<Language> languages = repository.findAll();

        assertThat(languages)
            .containsOnlyOnce(
                new Language("fr", "French"),
                new Language("en", "English")
            );
    }

    @Test
    void fails_fetching_languages_with_unsuccessful_authentication() {
        Credentials wrongCredentials = Credentials.of(CREDENTIALS.getUsername(), new char[]{'n', 'o', 'p', 'e'});
        LanguageRepository repository = new LanguageRepository(fakeLexicalaServer.getAddress(), httpClient(wrongCredentials));

        assertThatThrownBy(repository::findAll)
            .isInstanceOf(RuntimeException.class)
            .hasCauseInstanceOf(IOException.class)
            .hasMessageContaining("too many authentication attempts");
    }

}
