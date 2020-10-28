# Penda

![CI](https://github.com/fbiville/flowcon-penda/workflows/CI/badge.svg)

What is Penda?
It is a word play with the game of "Pendu" (Hangman)
and Panda.

It is also a fun game!

## Getting started

### Backend

#### Lexicala-based backend

Make sure you have created a [Lexicala](https://www.lexicala.com/) account.

Then, all you need to do is:

```shell
export LEXICALA_USERNAME=<your_username>
./run.sh
Lexicala password:>
```

The backend will prompt you for your Lexicala password.

The backend runs on port 8080 by default (can be tweaked via `application.properties` or setting a `PORT` envvar).

#### Fake server

Make sure to have [Node](https://nodejs.org) installed on your machine.

If you do not want to create a Lexicala account, you can instead run a fake server:

```shell
cd penda
npm run fake-server
```

The server will start on port 8080.

### Frontend

Make sure to have [Node](https://nodejs.org) installed on your machine.
Then, run:

```shell
cd penda
npm install
npx ng serve
```

Et voilà!
The game can start as soon as you open `http://localhost:4200`.
