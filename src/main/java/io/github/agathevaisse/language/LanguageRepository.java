package io.github.agathevaisse.language;

import io.github.agathevaisse.http.UpstreamException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class LanguageRepository {

  private final String baseUri;

  private final HttpClient httpClient;

  public LanguageRepository(String baseUri,
                            HttpClient httpClient) {
    this.baseUri = baseUri;
    this.httpClient = httpClient;
  }

  public List<Language> findAll() {
    HttpRequest request = HttpRequest.newBuilder()
                                     .header("Accept", "application/json")
                                     .uri(URI.create(String.format("%s/languages", baseUri)))
                                     .GET()
                                     .build();

    try {
      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() == 500) {
        throw new UpstreamException(parseError(response));
      }
      return parseResponse(response);
    } catch (IOException | InterruptedException e) {
      throw new UpstreamException(e.getMessage(), e);
    }
  }

  private List<Language> parseResponse(HttpResponse<String> response) {
    JSONObject jsonObject = new JSONObject(response.body());
    JSONObject languages = jsonObject.getJSONObject("language_names");
    Iterator<String> languageIterator = languages.keys();
    List<Language> result = new ArrayList<>(languages.length());
    while (languageIterator.hasNext()) {
      String code = languageIterator.next();
      String description = languages.getString(code);
      result.add(new Language(code, description));
    }
    return result;
  }

  private String parseError(HttpResponse<String> response) {
    JSONObject jsonObject = new JSONObject(response.body());
    return String
        .format("Failed to fetch languages: status=%d, message=%s",
                jsonObject.getInt("status"),
                jsonObject.getString("message"));
  }

}
