package io.github.agathevaisse.word;

import io.github.agathevaisse.functional.Either;
import io.github.agathevaisse.http.HttpError;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
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

        Either<HttpError, Word> result = wordApi.postRandomWord(request, response);

        assertThat(result).isEqualTo(Either.right(word));
        verify(response).header("Content-Type", "application/json");
        verify(response).status(200);
    }

    @Test
    void returns_bad_request_if_language_code_is_not_set() {
        Either<HttpError, Word> result = wordApi.postRandomWord(mock(Request.class), response);

        assertThat(result).isEqualTo(Either.<HttpError, Word>left(new HttpError("missing language code")));
        verify(response).header("Content-Type", "text/plain");
        verify(response).status(400);
    }

}
