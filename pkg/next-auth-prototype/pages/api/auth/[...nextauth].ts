import NextAuth, { AuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID || '',
      clientSecret: process.env.KEYCLOAK_SECRET || '',
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token || ''
        token.refreshToken = account.refresh_token || ''
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      session.user = token.user;
      return session;
    }
  }
}
export default NextAuth(authOptions)
