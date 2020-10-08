package io.github.agathevaisse.word;

import io.github.agathevaisse.functional.Either;
import io.github.agathevaisse.http.HttpError;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class WordJsonVisitorTest {

    @Test
    void transforms_word_to_json() {
        String panda = WordJsonVisitor.visit(Either.right(new Word("panda")));

        assertThat(panda).isEqualTo("{\"value\":\"panda\"}");
    }

    @Test
    void transforms_error_payload_to_text() {
        String panda = WordJsonVisitor.visit(Either.left(new HttpError("oopsie")));

        assertThat(panda).isEqualTo("oopsie");
    }

    @Test
    void fails_to_transform_non_words() {
        assertThatThrownBy(() -> WordJsonVisitor.visit("not a valid word object"))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Expected word, got class java.lang.String");
    }

    @Test
    void fails_to_transform_null() {
        assertThatThrownBy(() -> WordJsonVisitor.visit(null))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Expected word, got null");
    }
}
