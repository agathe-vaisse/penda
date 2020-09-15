package io.github.agathevaisse;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.Objects;

public class Credentials {

  private final String username;

  private final char[] password;

  private Credentials(String username, char[] password) {
    this.username = username;
    this.password = password;
  }

  public static Credentials of(String name, char[] password) {
    return new Credentials(name, password);
  }

  public String getUsername() {
    return username;
  }

  public char[] getPassword() {
    return password;
  }

  public String basicEncode() {
    Charset encoding = StandardCharsets.UTF_8;
    byte[] username = this.username.getBytes(encoding);
    byte[] separator = ":".getBytes(encoding);
    byte[] password = asByteArray(this.password, encoding);
    ByteBuffer buffer = ByteBuffer.allocate(username.length + separator.length + password.length)
                                  .put(username)
                                  .put(separator)
                                  .put(password)
                                  .compact();
    return Base64.getEncoder().encodeToString(buffer.array());
  }

  @Override public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Credentials that = (Credentials) o;
    return Objects.equals(username, that.username) &&
           Arrays.equals(password, that.password);
  }

  @Override public int hashCode() {
    int result = Objects.hash(username);
    result = 31 * result + Arrays.hashCode(password);
    return result;
  }

  @Override public String toString() {
    return "Credentials{" +
           "username='" + username + '\'' +
           ", password=(hidden)" +
           '}';
  }

  private static byte[] asByteArray(char[] chars, Charset encoding) {
    CharBuffer charBuffer = CharBuffer.wrap(chars);
    ByteBuffer byteBuffer = encoding.encode(charBuffer);
    byte[] bytes = Arrays.copyOfRange(byteBuffer.array(),
                                      byteBuffer.position(), byteBuffer.limit());
    Arrays.fill(byteBuffer.array(), (byte) 0);
    return bytes;
  }
}
