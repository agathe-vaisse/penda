package io.github.agathevaisse.word;

import io.github.agathevaisse.Credentials;
import io.github.agathevaisse.LexicalaBasicAuthenticator;
import io.github.agathevaisse.TestHttpServer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;

import java.io.IOException;

import static io.github.agathevaisse.Filters.contentNegotiationFilter;
import static io.github.agathevaisse.HttpClients.httpClient;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class WordRepositoryIT {

    public static final Credentials CREDENTIALS = Credentials.of("fakeuser", "fakepassword".toCharArray());

    private final Word randomWord = new Word("panda");

    @RegisterExtension
    TestHttpServer fakeLexicalaServer = TestHttpServer.withRandomPort()
        .withHandler(
            new LexicalaSearchFakeApi(randomWord),
            new LexicalaBasicAuthenticator(CREDENTIALS),
            contentNegotiationFilter(
                "*/*", "application/*", "application/json"));


    @Test
    void fetches_random_word() {
        WordRepository repository = new WordRepository(fakeLexicalaServer.getAddress(), httpClient(CREDENTIALS));

        Word word = repository.findRandom("fr");

        assertThat(word).isEqualTo(randomWord);
    }

    @Test
    void fails_fetching_random_word_with_unsuccessful_authentication() {
        Credentials wrongCredentials = Credentials.of(CREDENTIALS.getUsername(), new char[]{'n', 'o', 'p', 'e'});

        WordRepository repository = new WordRepository(fakeLexicalaServer.getAddress(), httpClient(wrongCredentials));

        assertThatThrownBy(() -> repository.findRandom("en"))
            .isInstanceOf(RuntimeException.class)
            .hasCauseInstanceOf(IOException.class)
            .hasMessageContaining("too many authentication attempts");
    }
}
