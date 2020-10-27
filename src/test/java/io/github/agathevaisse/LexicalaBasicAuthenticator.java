package io.github.agathevaisse;

import com.sun.net.httpserver.BasicAuthenticator;

import java.util.Arrays;

public class LexicalaBasicAuthenticator extends BasicAuthenticator {

    private final Credentials credentials;

    public LexicalaBasicAuthenticator(Credentials credentials) {
        super("Basic realm");
        this.credentials = credentials;
    }

    @Override
    public boolean checkCredentials(String username, String password) {
        return username.equals(credentials.getUsername()) && Arrays.equals(password.toCharArray(), credentials.getPassword());
    }
}
