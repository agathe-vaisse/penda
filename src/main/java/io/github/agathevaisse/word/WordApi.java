package io.github.agathevaisse.word;

import spark.Request;
import spark.Response;

public class WordApi {

    public static final String RANDOM_WORD_PATH = "/api/word";

    private final WordRepository wordRepository;

    public WordApi(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    public Word postRandomWord(Request request, Response response) {
        String languageCode = request.params("language");
        if (languageCode == null) {
            response.header("Content-Type", "text/plain");
            response.status(400);
            response.body("language code not set");
            return null;
        }
        response.header("Content-Type", "application/json");
        Word word = wordRepository.findRandom(languageCode);
        response.status(200);
        return word;
    }
}
