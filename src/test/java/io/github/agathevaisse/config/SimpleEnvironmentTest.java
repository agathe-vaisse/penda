package io.github.agathevaisse.config;

import org.junit.jupiter.api.Test;

import java.util.Properties;

import static com.github.stefanbirkner.systemlambda.SystemLambda.withEnvironmentVariable;
import static org.assertj.core.api.Assertions.assertThat;

class SimpleEnvironmentTest {

  @Test
  void looks_up_specified_configuration_file() {
    SimpleEnvironment environment = new SimpleEnvironment(props("foo-Bar.baz", "bar"));

    String result = environment.get("foo-Bar.baz");

    assertThat(result).isEqualTo("bar");
  }

  @Test
  void looks_up_environment_variable() throws Exception {
    SimpleEnvironment environment = new SimpleEnvironment(emptyProps());

    String result = withEnvironmentVariable("FOO_BAR_BAZ", "baz").execute(() -> environment.get("foo-Bar.baz"));

    assertThat(result).isEqualTo("baz");
  }

  @Test
  void looks_up_environment_variable_before_configured_property() throws Exception {
    SimpleEnvironment environment = new SimpleEnvironment(props("foo-Bar.baz", "bar"));

    String result = withEnvironmentVariable("FOO_BAR_BAZ", "baz").execute(() -> environment.get("foo-Bar.baz"));

    assertThat(result).isEqualTo("baz");
  }

  @Test
  void returns_empty_value_when_no_matching_configuration_found() {
    SimpleEnvironment environment = new SimpleEnvironment(emptyProps());

    String result = environment.get("not.found");

    assertThat(result).isNull();
  }

  @Test
  void returns_default_value() {
    SimpleEnvironment environment = new SimpleEnvironment(emptyProps());

    String result = environment.getOrDefault("foo", "bar");

    assertThat(result).isEqualTo("bar");
  }

  @Test
  void returns_nondefault_value() {
    SimpleEnvironment environment = new SimpleEnvironment(props("foo", "baz"));

    String result = environment.getOrDefault("foo", "bar");

    assertThat(result).isEqualTo("baz");
  }

  @Test
  void returns_nondefault_value_from_environment() throws Exception {
    SimpleEnvironment environment = new SimpleEnvironment(emptyProps());

    String result = withEnvironmentVariable("FOO", "baz").execute(() -> environment.getOrDefault("foo", "bar"));

    assertThat(result).isEqualTo("baz");
  }

  @Test
  void returns_scalar_value() {
    SimpleEnvironment environment = new SimpleEnvironment(props("foo", "12"));

    int result = environment.get("foo", Integer::parseInt);

    assertThat(result).isEqualTo(12);
  }

  @Test
  void returns_null_scalar_value() {
    SimpleEnvironment environment = new SimpleEnvironment(emptyProps());

    Integer result = environment.get("foo", Integer::parseInt);

    assertThat(result).isNull();
  }

  @Test
  void returns_default_scalar_value() {
    SimpleEnvironment environment = new SimpleEnvironment(emptyProps());

    int result = environment.getOrDefault("foo", Integer::parseInt, 12);

    assertThat(result).isEqualTo(12);
  }

  private static Properties props(String key, String value) {
    Properties properties = emptyProps();
    properties.setProperty(key, value);
    return properties;
  }

  private static Properties emptyProps() {
    return new Properties();
  }
}