package io.github.agathevaisse.language;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import java.util.List;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class LanguageApiTest {

  LanguageRepository languageRepository = mock(LanguageRepository.class);

  LanguageApi languageApi = new LanguageApi(languageRepository);

  @Test
  void returns_OK_response() {
    List<Language> languages = singletonList(new Language("fr", "French"));
    when(languageRepository.findAll()).thenReturn(languages);
    Response response = mock(Response.class, Mockito.RETURNS_DEEP_STUBS);

    List<Language> result = languageApi.getAllLanguages(mock(Request.class), response);

    assertThat(result).isSameAs(languages);
    verify(response).header("Content-Type", "application/json");
    verify(response).status(200);
  }

  @Test
  void returns_NoContent_response() {
    List<Language> languages = emptyList();
    when(languageRepository.findAll()).thenReturn(languages);
    Response response = mock(Response.class, Mockito.RETURNS_DEEP_STUBS);

    List<Language> result = languageApi.getAllLanguages(mock(Request.class), response);

    assertThat(result).isSameAs(languages);
    verify(response).header("Content-Type", "application/json");
    verify(response).status(204);
  }
}