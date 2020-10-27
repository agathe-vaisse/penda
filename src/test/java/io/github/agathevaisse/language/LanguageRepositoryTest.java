package io.github.agathevaisse.language;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;

import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandler;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

class LanguageRepositoryTest {

    HttpClient httpClient = mock(HttpClient.class);

    @SuppressWarnings("unchecked")
    HttpResponse<String> httpResponse = mock(HttpResponse.class);

    LanguageRepository languageRepository = new LanguageRepository("http://example.com", httpClient);

    @BeforeEach
    void setUp() throws Exception {
        given(httpClient.send(any(), ArgumentMatchers.<BodyHandler<String>>any())).willReturn(httpResponse);
    }

    @Test
    void parses_json_response() {
        given(httpResponse.body()).willReturn("{\"language_names\":  {\"fr\":  \"French\", \"en\":  \"English\"}}");

        List<Language> languages = languageRepository.findAll();

        assertThat(languages).containsExactlyInAnyOrder(
            new Language("fr", "French"),
            new Language("en", "English")
        );
    }

    @Test
    void fails_parsing_unsuccessful_response() {
        given(httpResponse.statusCode()).willReturn(500);
        given(httpResponse.body()).willReturn("{\"status\": 0, \"message\":  \"broken\"}");

        assertThatThrownBy(languageRepository::findAll)
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Failed to fetch languages: status=0, message=broken");
    }
}
