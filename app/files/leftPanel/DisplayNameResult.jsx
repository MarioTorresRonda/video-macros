import { toYoutubeName } from "@/nameFormats/main";

export default function DisplayNameResult( { displayNameBody } ) {
    return <p className="text-white text-2xl"> { toYoutubeName( displayNameBody.fileName ) } </p>
}