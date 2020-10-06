package io.github.agathevaisse.word;

import io.github.agathevaisse.language.Language;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;

public class WordRepository {

    private final String baseUri;

    private final HttpClient httpClient;

    public WordRepository(String baseUri,
                          HttpClient httpClient) {
        this.baseUri = baseUri;
        this.httpClient = httpClient;
    }

    public Word findRandom(String languageCode) {
        String uri = String.format(
            "%s/search?source=global&language=%s&sample=30&page-length=30",
            baseUri,
            languageCode
        );
        HttpRequest request = HttpRequest.newBuilder()
            .header("Accept", "application/json")
            .uri(URI.create(uri))
            .GET()
            .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int statusCode = response.statusCode();
            if (statusCode == 403 || statusCode == 500) {
                throw new RuntimeException(parseError(response));
            }
            return word(response);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private Word word(HttpResponse<String> response) {
        JSONObject jsonObject = new JSONObject(response.body());
        JSONArray words = jsonObject.getJSONArray("results");
        JSONObject word = words.getJSONObject(0);
        return new Word(word.getJSONObject("headword").getString("text"));
    }

    private String parseError(HttpResponse<String> response) {
        JSONObject jsonObject = new JSONObject(response.body());
        return String
            .format("Failed to fetch random word: status=%d, message=%s",
                jsonObject.getInt("status"),
                jsonObject.getString("message"));
    }
}
