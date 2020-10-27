package io.github.agathevaisse;

import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class Filters {

    public static Filter contentNegotiationFilter(String acceptableValue, String... acceptableValues) {
        Set<String> values = new HashSet<>(1 + acceptableValues.length);
        values.add(acceptableValue);
        values.addAll(Arrays.asList(acceptableValues));
        return new ContentNegotiationFilter(values);
    }
}

class ContentNegotiationFilter extends Filter {

    private final Set<String> acceptableValues;

    public ContentNegotiationFilter(Set<String> acceptableValues) {
        this.acceptableValues = acceptableValues;
    }

    @Override
    public void doFilter(HttpExchange exchange, Chain chain) throws IOException {
        Optional<String> acceptValue = exchange.getRequestHeaders()
            .get("Accept")
            .stream()
            .filter(acceptableValues::contains)
            .findFirst();
        if (acceptValue.isEmpty()) {
            exchange.sendResponseHeaders(406, 0);
            exchange.getResponseBody().close();
        } else {
            chain.doFilter(exchange);
        }
    }

    @Override
    public String description() {
        return "implements naive media type negotiation";
    }
}
