package io.github.agathevaisse;

import io.github.agathevaisse.http.BasicAuthenticator;

import java.net.http.HttpClient;

public class HttpClients {

    public static HttpClient httpClient(Credentials credentials) {
        return HttpClient.newBuilder()
            .authenticator(new BasicAuthenticator(credentials))
            .version(HttpClient.Version.HTTP_1_1)
            .build();
    }
}
