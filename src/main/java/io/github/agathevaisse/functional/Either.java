package io.github.agathevaisse.functional;

import java.util.Objects;
import java.util.function.Function;

public class Either<L, R> {

    private final L left;

    private final R right;

    private Either(L left, R right) {
        this.left = left;
        this.right = right;
    }

    public static <L, R> Either<L, R> left(L value) {
        return new Either<>(value, null);
    }

    public static <L, R> Either<L, R> right(R value) {
        return new Either<>(null, value);
    }

    public <T> T fold(Function<L, T> leftFn, Function<R, T> rightFn) {
        if (isLeft()) {
            return leftFn.apply(left);
        }
        return rightFn.apply(right);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Either<?, ?> either = (Either<?, ?>) o;
        if (left == null && either.left == null) return Objects.equals(right, either.right);
        if (right == null && either.right == null) return Objects.equals(left, either.left);
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(left, right);
    }

    @Override
    public String toString() {
        return "Either{" +
            "left=" + left +
            ", right=" + right +
            '}';
    }

    private boolean isLeft() {
        return left != null;
    }
}
