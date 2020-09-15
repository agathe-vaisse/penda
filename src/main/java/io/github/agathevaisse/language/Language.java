package io.github.agathevaisse.language;

import java.util.Objects;

public class Language {

  private final String code;

  private final String description;

  public Language(String code, String description) {

    this.code = code;
    this.description = description;
  }

  public String getCode() {
    return code;
  }

  public String getDescription() {
    return description;
  }

  @Override public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Language language = (Language) o;
    return Objects.equals(code, language.code) &&
           Objects.equals(description, language.description);
  }

  @Override public int hashCode() {
    return Objects.hash(code, description);
  }

  @Override public String toString() {
    return "Language{" +
           "code='" + code + '\'' +
           ", description='" + description + '\'' +
           '}';
  }
}
