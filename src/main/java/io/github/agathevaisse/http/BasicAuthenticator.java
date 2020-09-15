package io.github.agathevaisse.http;

import io.github.agathevaisse.Credentials;

import java.net.Authenticator;
import java.net.InetAddress;
import java.net.PasswordAuthentication;
import java.net.URL;

public class BasicAuthenticator extends Authenticator {

  private final Credentials credentials;

  public BasicAuthenticator(Credentials credentials) {

    this.credentials = credentials;
  }

  @Override public PasswordAuthentication requestPasswordAuthenticationInstance(String host, InetAddress addr, int port,
                                                                                String protocol, String prompt, String scheme,
                                                                                URL url, RequestorType reqType) {

    return new PasswordAuthentication(credentials.getUsername(), credentials.getPassword());
  }
}
