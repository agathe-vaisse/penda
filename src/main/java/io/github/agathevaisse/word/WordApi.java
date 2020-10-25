package io.github.agathevaisse.word;

import org.json.JSONObject;
import spark.Request;
import spark.Response;

public class WordApi {

    public static final String RANDOM_WORD_PATH = "/api/words";

    private final WordRepository wordRepository;

    public WordApi(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    public String postRandomWord(Request request, Response response) {
        String languageCode = request.queryParams("language");
        response.header("Content-Type", "application/json");
        if (languageCode == null) {
            response.status(400);
            response.header("Content-Type", "text/plain");
            return new JSONObject().put("error", "missing language code").toString();
        }
        response.status(200);
        Word random = wordRepository.findRandom(languageCode);
        return toJson(random);
    }

    private String toJson(Word randomWord) {
        JSONObject result = new JSONObject();
        result.put("value", randomWord.getValue());
        return result.toString();
    }
}
