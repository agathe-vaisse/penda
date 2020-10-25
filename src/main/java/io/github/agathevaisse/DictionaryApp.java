package io.github.agathevaisse;

import io.github.agathevaisse.config.SimpleEnvironment;
import io.github.agathevaisse.http.BasicAuthenticator;
import io.github.agathevaisse.http.UpstreamException;
import io.github.agathevaisse.language.LanguageApi;
import io.github.agathevaisse.language.LanguageRepository;
import io.github.agathevaisse.word.WordApi;
import io.github.agathevaisse.word.WordRepository;
import org.json.JSONObject;

import java.net.Authenticator;
import java.net.http.HttpClient;

import static io.github.agathevaisse.config.PropertiesLoader.fromClasspathResource;
import static spark.Spark.exception;
import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;

public class DictionaryApp {

    public static final String API_ROOT_PATH = "/api";

    public static void main(String[] args) {
        SimpleEnvironment environment = new SimpleEnvironment(fromClasspathResource("/application.properties"));
        int port = environment.getOrDefault("port", Integer::parseInt, 8080);
        HttpClient httpClient = lexicalaHttpClient(environment);
        LanguageApi languageApi = languageApi(languageRepository(environment, httpClient));
        WordApi wordApi = wordApi(wordRepository(environment, httpClient));

        port(port);
        exception(UpstreamException.class, (exception, request, response) -> {
            response.status(500);
            response.header("Content-Type", "application/json");
            response.body(new JSONObject().put("error", exception.toString()).toString());
        });
        get(LanguageApi.ALL_LANGUAGES_PATH, languageApi::getAllLanguages);
        post(WordApi.RANDOM_WORD_PATH, wordApi::postRandomWord);
    }

    private static LanguageApi languageApi(LanguageRepository languageRepository) {
        return new LanguageApi(languageRepository);
    }

    private static WordApi wordApi(WordRepository wordRepository) {
        return new WordApi(wordRepository);
    }

    private static LanguageRepository languageRepository(SimpleEnvironment environment, HttpClient httpClient) {
        return new LanguageRepository(
            environment.get("lexicala.base-uri"),
            httpClient
        );
    }

    private static WordRepository wordRepository(SimpleEnvironment environment, HttpClient httpClient) {
        return new WordRepository(
            environment.get("lexicala.base-uri"),
            httpClient
        );
    }

    private static HttpClient lexicalaHttpClient(SimpleEnvironment environment) {
        return HttpClient.newBuilder()
            .authenticator(lexicalaAuthenticator(environment))
            .version(HttpClient.Version.HTTP_1_1)
            .build();
    }

    private static Authenticator lexicalaAuthenticator(SimpleEnvironment environment) {
        return new BasicAuthenticator(lexicalaCredentials(environment));
    }

    private static Credentials lexicalaCredentials(SimpleEnvironment environment) {
        return Credentials.of(environment.get("lexicala.username"), promptLexicalaPassword());
    }

    private static char[] promptLexicalaPassword() {
        return System.console().readPassword("Lexicala password:> ");
    }
}
