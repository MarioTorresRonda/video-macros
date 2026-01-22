// app/api/video/route.js
import {createReadStream, statSync} from "fs";
import {join} from "path";

export async function GET(request) {
	const searchParams = request.nextUrl.searchParams;
	const videoPath = searchParams.get("videoPath");
	const range = request.headers.get("range");

  
	try {
    const stats = statSync(videoPath);
		const fileSize = stats.size;
    
    if (!range) {
		  const stream = createReadStream(videoPath);
      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": "video/mp4",
        },
      });
    }

		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		const chunkSize = end - start + 1;
		const stream = createReadStream(videoPath, {start, end});

		return new Response(stream, {
			status: 206,
			headers: {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunkSize.toString(),
				"Content-Type": "video/mp4",
			},
		});
	} catch (error) {
		return new Response("Video not found", {status: 404});
	}
}
