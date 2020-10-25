package io.github.agathevaisse.word;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentMatchers;

import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class WordRepositoryTest {

    HttpClient httpClient = mock(HttpClient.class);

    @SuppressWarnings("unchecked")
    HttpResponse<String> httpResponse = mock(HttpResponse.class);

    WordRepository wordRepository = new WordRepository("http://example.com", httpClient);

    @BeforeEach
    void setUp() throws Exception {
        given(httpClient.send(any(), ArgumentMatchers.<BodyHandler<String>>any())).willReturn(httpResponse);
    }

    @Test
    void fetches_random_word_in_a_specified_language() {
        given(httpResponse.body()).willReturn("{\n" +
            "    \"n_results\": 1,\n" +
            "    \"page_number\": 1,\n" +
            "    \"results_per_page\": 1,\n" +
            "    \"n_pages\": 1,\n" +
            "    \"available_n_pages\": 1,\n" +
            "    \"results\": [\n" +
            "        {\n" +
            "            \"id\": \"FR_DE00006025\",\n" +
            "            \"language\": \"fr\",\n" +
            "            \"headword\": {\n" +
            "                \"text\": \"panda\",\n" +
            "                \"pos\": \"noun\"\n" +
            "            },\n" +
            "            \"senses\": [\n" +
            "                {\n" +
            "                    \"id\": \"FR_SE00009047\",\n" +
            "                    \"definition\": \"gentil animal qui poutre\"\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    ]\n" +
            "}");

        Word word = wordRepository.findRandom("fr");

        assertThat(word)
            .isEqualTo(new Word("panda"));
    }

    @Test
    void fetches_random_adjective_in_a_specified_language() {
        given(httpResponse.body()).willReturn("{\n" +
            "    \"n_results\": 1,\n" +
            "    \"page_number\": 1,\n" +
            "    \"results_per_page\": 1,\n" +
            "    \"n_pages\": 1,\n" +
            "    \"available_n_pages\": 1,\n" +
            "    \"results\": [\n" +
            "        {\n" +
            "            \"id\": \"FR_DE00097898\",\n" +
            "            \"language\": \"fr\",\n" +
            "            \"headword\": [\n" +
            "                {\n" +
            "                    \"text\": \"domanial\",\n" +
            "                    \"pos\": \"adjective\"\n" +
            "                },\n" +
            "                {\n" +
            "                    \"text\": \"domaniale\",\n" +
            "                    \"pos\": \"adjective\"\n" +
            "                }\n" +
            "            ],\n" +
            "            \"senses\": [\n" +
            "                {\n" +
            "                    \"id\": \"FR_SE00101522\",\n" +
            "                    \"definition\": \"qui appartient à l'État\"\n" +
            "                }\n" +
            "            ]\n" +
            "        }" +
            "\n" +
            "    ]\n" +
            "}");

        Word word = wordRepository.findRandom("fr");

        assertThat(word)
            .isEqualTo(new Word("domanial"));
    }

    @ParameterizedTest
    @ValueSource(ints = {403, 500})
    void returns_empty_words_if_server_returns_error_code(int errorCode) {
        given(httpResponse.statusCode()).willReturn(errorCode);
        given(httpResponse.body()).willReturn("{\"status\": 0, \"message\":  \"broken\"}");

        assertThatThrownBy(() -> wordRepository.findRandom("fr"))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Failed to fetch random word: status=0, message=broken");
    }
}
