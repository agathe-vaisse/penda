package io.github.agathevaisse.word;

import io.github.agathevaisse.functional.Either;
import io.github.agathevaisse.http.HttpError;
import org.json.JSONObject;

import java.util.Optional;
import java.util.function.Function;

public class WordJsonVisitor {

    @SuppressWarnings("unchecked")
    public static String visit(Object object) {
        if (!(object instanceof Either)) {
            throw new IllegalArgumentException(
                String.format("Expected word, got %s", object == null ? "null" : object.getClass()));
        }

        Either<HttpError, Word> word = (Either<HttpError, Word>) object;
        return word.fold(
            HttpError::getValue,
            (value) -> doVisit(value).toString()
        );
    }

    private static JSONObject doVisit(Word word) {
        JSONObject result = new JSONObject();
        result.put("value", word.getValue());
        return result;
    }
}
