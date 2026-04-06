import PrettyButton from "@/components/Commons/PrettyButton";
import { compressVideo } from "@/http/video";
import { OptionContext } from "@/store/option-context";
import { useContext } from "react";

export default function CompressButton( { selectedVideos, formatted, handleVideoPathUpdate } ) {

    
    const { mainFolder } = useContext( OptionContext );
    

    async function compressVideos() {
        for( const video of selectedVideos ) {
            const params = {
                mainFolder,
                fileName : video,
            };

            await compressVideo( params, {} )
            handleVideoPathUpdate();
        }
    }

    return <PrettyButton
        onClick={compressVideos}
        disabled={formatted}    
    >
        Comprimir { selectedVideos.length }
    </PrettyButton>
}