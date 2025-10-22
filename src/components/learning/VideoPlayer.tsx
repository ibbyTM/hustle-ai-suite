interface VideoPlayerProps {
  videoUrl?: string;
  provider?: "youtube" | "vimeo" | "custom";
}

export const VideoPlayer = ({ videoUrl, provider = "youtube" }: VideoPlayerProps) => {
  if (!videoUrl) return null;

  const getEmbedUrl = (url: string) => {
    // Convert standard YouTube URLs to embed format
    if (provider === "youtube") {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Convert standard Vimeo URLs to embed format
    if (provider === "vimeo") {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    return url; // Return as-is for custom or already-formatted URLs
  };

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden mb-6 bg-black">
      <iframe
        src={getEmbedUrl(videoUrl)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Course video"
      />
    </div>
  );
};
