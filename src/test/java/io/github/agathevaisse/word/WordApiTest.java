package io.github.agathevaisse.word;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class WordApiTest {

    WordRepository wordRepository = mock(WordRepository.class);

    WordApi wordApi = new WordApi(wordRepository);

    Response response = mock(Response.class, Mockito.RETURNS_DEEP_STUBS);

    @AfterEach
    void apis_do_not_set_response_body_because_visitors_do() {
        verify(response, never()).body();
    }

    @Test
    void exposes_randomly_selected_word() {
        Word word = new Word("panda");
        when(wordRepository.findRandom("fr")).thenReturn(word);
        Request request = mock(Request.class);
        when(request.queryParams("language")).thenReturn("fr");

        String result = wordApi.postRandomWord(request, response);

        assertThat(result).isEqualTo("{\"value\":\"panda\"}");
        verify(response).header("Content-Type", "application/json");
        verify(response).status(200);
    }

    @Test
    void returns_bad_request_if_language_code_is_not_set() {
        String result = wordApi.postRandomWord(mock(Request.class), response);

        assertThat(result).isEqualTo("{\"error\":\"missing language code\"}");
        verify(response).header("Content-Type", "application/json");
        verify(response).status(400);
    }

}
