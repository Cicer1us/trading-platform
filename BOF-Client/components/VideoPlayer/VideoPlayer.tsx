import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import Modal from '../Modal/Modal';
import style from './VideoPlayer.module.css';

interface VideoPlayerProps {
  videoId: string | null;
  onClose: () => void;
  title: string | null;
}

const opts: YouTubeProps['opts'] = {
  height: '390',
  width: '640',
  playerVars: {
    autoplay: 1,
  },
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ title, videoId, onClose }: VideoPlayerProps) => {
  const onPlayerReady: YouTubeProps['onReady'] = event => {
    event.target.playVideo();
  };
  return (
    <Modal active={!!videoId} setActive={onClose} className={style.video}>
      <div className={style.content}>
        {videoId && (
          <YouTube
            className={style.videoPlayer}
            videoId={videoId}
            iframeClassName={style.videoPlayer}
            opts={opts}
            onReady={onPlayerReady}
          />
        )}
        <div className={style.title}>{title}</div>
      </div>
    </Modal>
  );
};
