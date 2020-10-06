package io.github.agathevaisse.word;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class WordJsonVisitorTest {

    @Test
    void transforms_word_to_json() {
        String panda = WordJsonVisitor.visit(new Word("panda"));

        assertThat(panda).isEqualTo("{\"value\":\"panda\"}");
    }

    @Test
    void fails_to_transform_non_words() {
        assertThatThrownBy(() -> WordJsonVisitor.visit("not a word object"))
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
