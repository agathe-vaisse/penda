package io.github.agathevaisse.config;

import io.github.agathevaisse.DictionaryApp;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Properties;

import static java.nio.charset.StandardCharsets.UTF_8;

public class PropertiesLoader {

  public static Properties fromClasspathResource(String classpathResource) {
    Properties properties = new Properties();
    try (Reader reader = new InputStreamReader(PropertiesLoader.class.getResourceAsStream(classpathResource), UTF_8)) {
      properties.load(reader);
    } catch (IOException e) {
      throw new RuntimeException(e.getMessage(), e);
    }
    return properties;
  }
}
