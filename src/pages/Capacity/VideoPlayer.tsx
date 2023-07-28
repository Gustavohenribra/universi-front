import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoPlayer.css'
import Footer from '@/components/Footer/Footer';
import StarRating from './Components/StarRating/StarRating';
import VideoAnimationPlayer from './Components/Animation/VideoAnimationPlayer';

interface Video {
  id: number;
  title: string;
  url: string;
  description: string;
  rating: number;
  category: string;
}

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [isVideoReady, setVideoReady] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/capacitacao/video/${videoId}`);
        setVideo(response.data);
      } catch (error) {
        console.error('Erro ao buscar o vídeo:', error);
      }
    };
    fetchVideoData();
  }, [videoId]);

  const getVideoId = (url: string) => {
    const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  useEffect(() => {
    const loadYouTubeScript = () => {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(scriptTag);
    };

    (window as any).onYouTubeIframeAPIReady = () => {
      setVideoReady(true);
    };

    loadYouTubeScript();
  }, []);

  useEffect(() => {
    if (isVideoReady && video && video.url && !playerRef.current) {
      playerRef.current = new YT.Player('player', {
        height: '500',
        width: '1000',
        videoId: getVideoId(video.url),
      });
    }
  }, [isVideoReady, video]);

  return (
    <div>
      {video ? (
        <>
            <div id="conteudo-video">
                <div id="player" className="youtube-video"></div>
                <VideoAnimationPlayer/>
                <p className="error-video">Falha ao carregar o vídeo: Recarregue a página...</p>
            </div>
            <div id="information-video">
                <div className="details-video">
                    <div className="box-title">
                        <h2 className="panel-title">{video.title}</h2>
                    </div>
                    <div className="box-rating">
                      <p className="content-rating">
                        <span className="rating-count">{video.rating.toFixed(1)}</span>
                        <span className="star-rating">
                          <StarRating rating={video.rating} />
                        </span>
                      </p>
                    </div>
                </div>
                <p className="panel-description">{video.description}</p>
                <Footer/>
            </div>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default VideoPage;