package io.github.agathevaisse;

import com.sun.net.httpserver.HttpHandler;

public interface ContextHttpHandler extends HttpHandler {
  String getContext();
}
