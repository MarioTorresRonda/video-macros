import Checkbox from "@/components/Forms/Checkbox";
import { fromFileNamePath } from "@/nameFormats/main";

export default function VideoRow( { fileName, selectedVideos, setSelectedVideos, afterHandleSelect } ) {

    function onHandleSelectVideo( event ) {
        setSelectedVideos( ( oldSelectedVideos ) => {
            let newSelectedVideos; 
            if ( event.target.checked ) {
                newSelectedVideos = [...oldSelectedVideos, fileName ];
            }else{
                newSelectedVideos = oldSelectedVideos.filter( ( videoName ) => videoName != fileName )
            }
            afterHandleSelect( newSelectedVideos );
            return newSelectedVideos;
        } )
    }

    return <div className=" h-12 flex flex-col justify-center">
        <div className="bg-slate-600 h-0.5" ></div>
        <div className="flex flex-row gap-3 flex-1 ml-3">
            <Checkbox id={fileName+"_S"} text="" checked={ selectedVideos.find( (videoName) => videoName == fileName ) } onChange={onHandleSelectVideo} />
            <div key={fileName} className="text-white self-center overflow-hidden"> { fromFileNamePath( fileName ) } </div>
        </div>
    </div>
}