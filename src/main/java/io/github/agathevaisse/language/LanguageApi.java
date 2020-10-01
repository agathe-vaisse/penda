package io.github.agathevaisse.language;

import spark.Request;
import spark.Response;

import java.util.List;

import static io.github.agathevaisse.DictionaryApp.API_ROOT_PATH;

public class LanguageApi {

  public static final String ALL_LANGUAGES_PATH = API_ROOT_PATH + "/languages";

  private final LanguageRepository languageRepository;

  public LanguageApi(LanguageRepository languageRepository) {
    this.languageRepository = languageRepository;
  }

  public List<Language> getAllLanguages(Request request, Response response) {
    response.header("Content-Type", "application/json");
    List<Language> languages = languageRepository.findAll();
    response.status(languages.isEmpty() ? 204 : 200);
    return languages;
  }
}
