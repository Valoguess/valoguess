import { createAuthClient } from "better-auth/react";
import { anonymousClient, jwtClient, usernameClient } from "better-auth/client/plugins"

export const { signIn, signUp, signOut, useSession, token } = createAuthClient({
  plugins: [
    anonymousClient(),
    usernameClient({
      displayUsername: false
    }),
    jwtClient(),
  ]
});

export const googleSignIn = (callbackURL: string) => signIn.social({
  provider: "google",
  callbackURL,
});
