package io.github.agathevaisse.language;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class LanguageJsonVisitor {

  @SuppressWarnings("unchecked")
  public static String visitAll(Object languages) {
    if (!(languages instanceof Collection)) {
      throw new IllegalArgumentException(
          String.format("Expected list of languages, got %s", languages == null ? "null" : languages.getClass()));
    }
    return doVisitAll((Collection<Language>) languages).toString();
  }

  private static JSONArray doVisitAll(Collection<Language> languages) {
    return new JSONArray(languages.stream().map(LanguageJsonVisitor::visit).collect(Collectors.toList()));
  }

  private static JSONObject visit(Language language) {
    JSONObject result = new JSONObject();
    result.put("code", language.getCode());
    result.put("description", language.getDescription());
    return result;
  }
}
