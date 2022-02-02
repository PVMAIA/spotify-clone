import { useRecoilValue } from "recoil";
import { playlistState } from "../../atoms/playlistAtom";
import Song from "../Song";

function Songs() {
   const playList = useRecoilValue(playlistState);

   return (
      <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
         {playList?.tracks.items.map((track, i) => (
            <Song key={track.track.id} order={i} track={track} />
         ))}
      </div>
   );
}

export default Songs;
