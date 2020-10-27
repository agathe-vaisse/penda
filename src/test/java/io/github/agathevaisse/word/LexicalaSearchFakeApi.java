package io.github.agathevaisse.word;

import com.sun.net.httpserver.HttpExchange;
import io.github.agathevaisse.ContextHttpHandler;

import java.io.IOException;
import java.io.OutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;

public class LexicalaSearchFakeApi implements ContextHttpHandler {

    static final String CONTEXT = "/search";

    private final Word randomWord;

    public LexicalaSearchFakeApi(Word randomWord) {
        this.randomWord = randomWord;
    }

    private static String serialize(Word randomWord) {
        return String.format("{\"results\": [{\"headword\": {\"text\": \"%s\"}}]}", randomWord.getValue());
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
        String responseBody = serialize(this.randomWord);
        exchange.sendResponseHeaders(200, responseBody.length());
        responseStream.write(responseBody.getBytes(UTF_8));
    }
}
