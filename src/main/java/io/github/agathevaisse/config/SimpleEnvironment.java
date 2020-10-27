package io.github.agathevaisse.config;

import java.util.Locale;
import java.util.Properties;
import java.util.function.Function;

public class SimpleEnvironment {

    private final Properties properties;

    public SimpleEnvironment(Properties properties) {
        this.properties = properties;
    }

    public <T> T get(String key, Function<String, T> mapper) {
        String result = get(key);
        return result == null ? null : mapper.apply(result);
    }

    public String getOrDefault(String key, String defaultValue) {
        return getOrDefault(key, Function.identity(), defaultValue);
    }

    public <T> T getOrDefault(String key, Function<String, T> mapper, T defaultValue) {
        String result = get(key);
        return result == null ? defaultValue : mapper.apply(result);
    }

    public String get(String key) {
        String result = lookupEnvironment(key);
        return result == null ? properties.getProperty(key) : result;
    }

    private String lookupEnvironment(String key) {
        return System.getenv(transformKey(key));
    }

    private String transformKey(String key) {
        return key.replaceAll("(a-z)([A-Z])", "$1_$2")
            .replace('-', '_')
            .replace('.', '_')
            .toUpperCase(Locale.ENGLISH);
    }
}
