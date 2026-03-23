import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Box, Typography, Button } from '@mui/material';

interface VideoMarker {
  id: number;
  marker_type: 'chapter' | 'question' | 'pause';
  timestamp_sec: number;
  title?: string;
  quiz_question_id?: number;
  quiz_question?: any;
}

interface VideoPlayerProps {
  src: string; // HLS .m3u8 URL
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  initialTime?: number;
  autoPlay?: boolean;
  markers?: VideoMarker[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  onTimeUpdate,
  initialTime = 0,
  autoPlay = false,
  markers = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [activeMarker, setActiveMarker] = React.useState<VideoMarker | null>(null);
  const [triggeredMarkers, setTriggeredMarkers] = React.useState<Set<number>>(new Set());
  const [currentTime, setCurrentTime] = React.useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        startPosition: initialTime,
        capLevelToPlayerSize: true,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(e => console.error("Autoplay prevented", e));
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal HLS error", data);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = initialTime;
        if (autoPlay) video.play();
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, initialTime, autoPlay]);

  useEffect(() => {
    if (!markers) return;
    
    // Check for markers near current time
    const marker = markers.find(m => 
      Math.abs(m.timestamp_sec - currentTime) < 0.5 && 
      !triggeredMarkers.has(m.id)
    );

    if (marker) {
      setActiveMarker(marker);
      setTriggeredMarkers(prev => new Set(prev).add(marker.id));
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [currentTime, markers, triggeredMarkers]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) onTimeUpdate(time);
    }
  };

  const handleMarkerResume = () => {
    setActiveMarker(null);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Resume failed", e));
    }
  };

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: '#000' }}>
      <video
        ref={videoRef}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        controls={!activeMarker}
        controlsList="nodownload"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      >
        Your browser does not support the video tag.
      </video>

      {activeMarker && (
        <Box 
          sx={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            bgcolor: 'rgba(0,0,0,0.85)', zIndex: 10, display: 'flex', 
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            p: 4, color: '#fff', textAlign: 'center'
          }}
        >
          {activeMarker.marker_type === 'question' && activeMarker.quiz_question ? (
            <Box sx={{ maxWidth: 600, width: '100%', bgcolor: '#fff', borderRadius: 2, p: 3, color: '#333' }}>
               <Typography variant="h6" gutterBottom color="primary">Quick Question</Typography>
               <Typography variant="body1" sx={{ mb: 3 }}>{activeMarker.quiz_question.question_text}</Typography>
               {/* Simplified interaction: show options or just continue */}
               {/* In a fuller version, we'd render the actual question UI here */}
               <Button variant="contained" onClick={handleMarkerResume}>
                 Submit & Continue
               </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h5" gutterBottom>{activeMarker.title || 'Paused'}</Typography>
              <Button variant="contained" onClick={handleMarkerResume} sx={{ mt: 2 }}>
                Continue Video
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;
