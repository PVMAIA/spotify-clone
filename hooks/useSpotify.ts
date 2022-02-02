import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
   clientId: String(process.env.NEXT_PUBLIC_CLIENT_ID),
   clientSecret: String(process.env.NEXT_PUBLIC_CLIENT_SECRET),
});

function useSpotify() {
   const { data: session, status } = useSession();

   useEffect(() => {
      if (session) {
         if (session.error === "RefreshAccessTokenError") {
            signIn();
         }

         spotifyApi.setAccessToken(String(session.accessToken));
      }
   }, [session]);

   return spotifyApi;
}

export default useSpotify;
