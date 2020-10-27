package io.github.agathevaisse.language;

import org.json.JSONArray;
import org.json.JSONObject;
import spark.Request;
import spark.Response;

import java.util.List;
import java.util.stream.Collectors;

import static io.github.agathevaisse.DictionaryApp.API_ROOT_PATH;

public class LanguageApi {

    public static final String ALL_LANGUAGES_PATH = API_ROOT_PATH + "/languages";

    private final LanguageRepository languageRepository;

    public LanguageApi(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    private static JSONObject visit(Language language) {
        JSONObject result = new JSONObject();
        result.put("code", language.getCode());
        result.put("description", language.getDescription());
        return result;
    }

    public String getAllLanguages(Request request, Response response) {
        response.header("Content-Type", "application/json");
        List<Language> languages = languageRepository.findAll();
        response.status(languages.isEmpty() ? 204 : 200);
        return toJson(languages);
    }

    private String toJson(List<Language> languages) {
        return new JSONArray(languages.stream()
            .map(LanguageApi::visit)
            .collect(Collectors.toList()))
            .toString();
    }
}
