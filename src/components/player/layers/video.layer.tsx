interface VideoLayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

const VideoLayer: React.FC<VideoLayerProps> = ({ videoRef }) => {
  return (
    <div className="absolute inset-0 bg-black z-0">
      <video
        ref={videoRef}
        playsInline
        className="w-full h-full object-contain relative z-10" 
      />
      <div className="hidden absolute inset-0 z-20 pointer-events-none" data-poster />
    </div>
  )
}

export default VideoLayer