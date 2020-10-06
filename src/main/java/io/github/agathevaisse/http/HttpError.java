package io.github.agathevaisse.http;

import java.util.Objects;

public class HttpError {

    private final String value;

    public HttpError(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HttpError httpError = (HttpError) o;
        return Objects.equals(value, httpError.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return "ErrorPayload{" +
            "value='" + value + '\'' +
            '}';
    }


}
