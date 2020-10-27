package io.github.agathevaisse.language;

import com.sun.net.httpserver.HttpExchange;
import io.github.agathevaisse.ContextHttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.stream.Collectors.joining;

public class LexicalaLanguageFakeApi implements ContextHttpHandler {

    static final String CONTEXT = "/languages";

    private final List<Language> languages = new ArrayList<>();

    public LexicalaLanguageFakeApi(Language language, Language... languages) {
        this.languages.add(language);
        this.languages.addAll(Arrays.asList(languages));
    }

    private static String serialize(List<Language> languages) {
        return languages.
            stream().
            map(l -> String.format("\"%s\": \"%s\"", l.getCode(), l.getDescription())).
            collect(joining(",", "{\"language_names\": {", "}}"));
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try (OutputStream responseStream = exchange.getResponseBody()) {
            sendResponse(exchange, responseStream);
        }
    }

    @Override
    public String getContext() {
        return CONTEXT;
    }

    private void sendResponse(HttpExchange exchange, OutputStream responseStream) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        String responseBody = serialize(this.languages);
        exchange.sendResponseHeaders(200, responseBody.length());
        responseStream.write(responseBody.getBytes(UTF_8));
    }
}
