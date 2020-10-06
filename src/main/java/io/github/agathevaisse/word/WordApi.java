package io.github.agathevaisse.word;

import io.github.agathevaisse.functional.Either;
import io.github.agathevaisse.http.HttpError;
import spark.Request;
import spark.Response;

public class WordApi {

    public static final String RANDOM_WORD_PATH = "/api/words";

    private final WordRepository wordRepository;

    public WordApi(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    public Either<HttpError, Word> postRandomWord(Request request, Response response) {
        String languageCode = request.queryParams("language");
        if (languageCode == null) {
            response.status(400);
            response.header("Content-Type", "text/plain");
            response.body("missing language code");
            return Either.left(new HttpError("missing language code"));
        }
        response.status(200);
        response.header("Content-Type", "application/json");
        return Either.right(wordRepository.findRandom(languageCode));
    }
}
