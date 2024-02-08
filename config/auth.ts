import { defineConfig } from "@adonisjs/auth";
import { InferAuthEvents, Authenticators } from "@adonisjs/auth/types";
import {
  basicAuthGuard,
  basicAuthUserProvider,
} from "@adonisjs/auth/basic_auth";
import User from "#models/user";

const authConfig = defineConfig({
  default: "cookieAuth",
  guards: {
    cookieAuth: basicAuthGuard({
      provider: basicAuthUserProvider({
        model: () => import("#models/user"),
      }),
    }),
  },
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module "@adonisjs/auth/types" {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module "@adonisjs/core/types" {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
