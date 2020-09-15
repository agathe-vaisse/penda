package io.github.agathevaisse.language;

import org.junit.jupiter.api.Test;

import java.util.Collection;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LanguageJsonVisitorTest {

  @Test
  void transforms_list_of_languages_to_json() {
    Collection<Language> languages = Set.of(new Language("tlh", "Klingon"));

    String json = LanguageJsonVisitor.visitAll(languages);

    assertThat(json).isEqualTo("[{\"code\":\"tlh\",\"description\":\"Klingon\"}]");
  }

  @Test
  void fails_transforming_when_given_non_collection() {
    Object notACollection = new Object();

    assertThatThrownBy(() -> LanguageJsonVisitor.visitAll(notACollection))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Expected list of languages, got class java.lang.Object");
  }

  @Test
  void fails_transforming_when_given_null() {
    Object notACollection = null;

    assertThatThrownBy(() -> LanguageJsonVisitor.visitAll(notACollection))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Expected list of languages, got null");
  }

  @Test
  void fails_transforming_when_given_collection_of_non_languages() {
    Collection<String> notTheRightCollection = Set.of("oopsie");

    assertThatThrownBy(() -> LanguageJsonVisitor.visitAll(notTheRightCollection))
        .isInstanceOf(ClassCastException.class)
        .hasMessageContaining("class java.lang.String cannot be cast to class io.github.agathevaisse.language.Language");
  }
}