package io.github.agathevaisse.word;

import org.json.JSONObject;

public class WordJsonVisitor {

    @SuppressWarnings("unchecked")
    public static String visit(Object word) {
        if (!(word instanceof Word)) {
            throw new IllegalArgumentException(
                String.format("Expected word, got %s", word == null ? "null" : word.getClass()));
        }
        return doVisit((Word) word).toString();
    }

    private static JSONObject doVisit(Word word) {
        JSONObject result = new JSONObject();
        result.put("value", word.getValue());
        return result;
    }
}
