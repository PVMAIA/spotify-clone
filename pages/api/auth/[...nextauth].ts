import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

interface JWTData extends JWT {
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
}

async function refreshAccessToken(token: JWTData) {
  try {
    spotifyApi.setAccessToken(String(token.accessToken));
    spotifyApi.setRefreshToken(String(token.refreshToken));

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: String(process.env.NEXT_PUBLIC_CLIENT_ID),
      clientSecret: String(process.env.NEXT_PUBLIC_CLIENT_SECRET),
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: Number(account.expires_at ?? 0) * 1000,
        };
      }

      if (Date.now() < Number(token.accessTokenExpires)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.username = token.username;

      return session;
    },
  },
});
