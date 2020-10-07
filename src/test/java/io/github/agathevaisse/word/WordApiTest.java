package io.github.agathevaisse.word;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class WordApiTest {

    WordRepository wordRepository = mock(WordRepository.class);

    WordApi wordApi = new WordApi(wordRepository);

    @Test
    void exposes_randomly_selected_word() {
        Word word = new Word("panda");
        when(wordRepository.findRandom("fr")).thenReturn(word);
        Request request = mock(Request.class);
        when(request.queryParams("language")).thenReturn("fr");
        Response response = mock(Response.class, Mockito.RETURNS_DEEP_STUBS);

        Word result = wordApi.postRandomWord(request, response);

        assertThat(result).isSameAs(word);
        verify(response).header("Content-Type", "application/json");
        verify(response).status(200);
    }

    @Test
    void returns_bad_request_if_language_code_is_not_set() {
        Response response = mock(Response.class, Mockito.RETURNS_DEEP_STUBS);

        Word result = wordApi.postRandomWord(mock(Request.class), response);

        assertThat(result).isNull();
        verify(response).header("Content-Type", "text/plain");
        verify(response).status(400);
        verify(response).body("language code not set");
    }

}
