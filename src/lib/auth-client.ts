import { createAuthClient } from "better-auth/react";
import { anonymousClient, usernameClient } from "better-auth/client/plugins"

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  plugins: [
    anonymousClient(),
    usernameClient({
      displayUsername: false
    }),
  ]
});

export const googleSignIn = (callbackURL: string) => signIn.social({
  provider: "google",
  callbackURL,
});
