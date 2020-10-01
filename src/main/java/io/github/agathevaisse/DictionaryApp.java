package io.github.agathevaisse;

import io.github.agathevaisse.config.SimpleEnvironment;
import io.github.agathevaisse.http.BasicAuthenticator;
import io.github.agathevaisse.language.LanguageApi;
import io.github.agathevaisse.language.LanguageJsonVisitor;
import io.github.agathevaisse.language.LanguageRepository;
import spark.Spark;

import java.net.Authenticator;
import java.net.http.HttpClient;

import static io.github.agathevaisse.config.PropertiesLoader.fromClasspathResource;

public class DictionaryApp {

  public static final String API_ROOT_PATH="/api";

  public static void main(String[] args) {
    SimpleEnvironment environment = new SimpleEnvironment(fromClasspathResource("/application.properties"));
    int port = environment.getOrDefault("port", Integer::parseInt, 8080);
    LanguageApi languageApi = languageApi(environment);
    Spark.port(port);
    Spark.get(LanguageApi.ALL_LANGUAGES_PATH, languageApi::getAllLanguages, LanguageJsonVisitor::visitAll);
  }

  private static LanguageApi languageApi(SimpleEnvironment environment) {
    return new LanguageApi(
        languageRepository(environment)
    );
  }

  private static LanguageRepository languageRepository(SimpleEnvironment environment) {
    return new LanguageRepository(
        environment.get("lexicala.base-uri"),
        lexicalaHttpClient(environment)
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
