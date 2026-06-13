import { toYoutubeName } from "@/nameFormats/main";
import { durationToTime } from "@/util/time";

export default function VideoMergeInfo( { videoMerge, infoFiles } )  {

    let duration = 0;

    return <div className=" flex-1 flex flex-col gap-1 rounded-md text-white text-xl overflow-auto">
        { videoMerge.map( (video) => {
            const videoDuration = infoFiles && infoFiles[video.fullName] ? infoFiles[video.fullName].duration : 0
            const startTime = durationToTime( duration )
            duration += parseFloat( videoDuration );
            return <p className='text-nowrap' key={video.videoID } > { startTime } - { toYoutubeName( video.fullName ) } </p>
        } ) } 
    </div>

}