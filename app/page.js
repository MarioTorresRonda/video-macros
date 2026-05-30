import Options from "@/components/Main/Options";
import FileSearch from "./files/FileSearch";
import YoutubeTimestamp from "@/components/Main/YoutubeTimestamp";

export default function Home() {
  return (
    <>
      <Options />
      <YoutubeTimestamp />
      <FileSearch />
    </>
  );
}
