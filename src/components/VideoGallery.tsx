import React, { useState } from 'react';
import { X, Play, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface Video {
  url: string;
  title: string;
}

interface VideoGalleryProps {
  instagramVideos: Video[];
  tiktokVideos: Video[];
  styles: {
    text: string;
    link: string;
    cardBg: string;
    button: string;
  };
  isCollapsible?: boolean;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ instagramVideos, tiktokVideos, styles, isCollapsible = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | null>(null);
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);
  const { t } = useSettings();

  const openVideoModal = (video: Video, platform: 'instagram' | 'tiktok') => {
    setSelectedVideo(video);
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setSelectedPlatform(null);
  };

  const getEmbedUrl = (url: string, platform: 'instagram' | 'tiktok') => {
    if (platform === 'instagram') {
      // Extract the post ID from Instagram URL
      const match = url.match(/\/reel\/([^\/\?]+)/);
      if (match) {
        return `https://www.instagram.com/p/${match[1]}/embed/`;
      }
    } else if (platform === 'tiktok') {
      // Extract video ID from TikTok URL
      const match = url.match(/\/video\/(\d+)/);
      if (match) {
        return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
    }
    return url;
  };

  if (isCollapsible) {
    return (
      <>
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 flex items-center justify-between ${styles.cardBg}`}
          >
            <span className={`font-pixel ${styles.text}`}>
              📱 Instagram Reels ({instagramVideos.length})
            </span>
            {isExpanded ? <ChevronUp className={`w-5 h-5 ${styles.text}`} /> : <ChevronDown className={`w-5 h-5 ${styles.text}`} />}
          </button>
          
          {isExpanded && (
            <div className="mt-4 space-y-6">
              {instagramVideos.length > 0 && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {instagramVideos.map((video, index) => (
                      <div
                        key={index}
                        className={`p-4 border-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${styles.cardBg}`}
                        onClick={() => openVideoModal(video, 'instagram')}
                      >
                        <div className="flex items-center justify-center h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg mb-2">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <p className={`text-center font-pixel ${styles.text}`}>{video.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tiktokVideos.length > 0 && (
                <div>
                  <h4 className={`text-lg font-bold mb-3 font-pixel ${styles.text}`}>
                    🎵 TikTok Videos ({tiktokVideos.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tiktokVideos.map((video, index) => (
                      <div
                        key={index}
                        className={`p-4 border-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${styles.cardBg}`}
                        onClick={() => openVideoModal(video, 'tiktok')}
                      >
                        <div className="flex items-center justify-center h-32 bg-gradient-to-br from-black to-red-500 rounded-lg mb-2">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <p className={`text-center font-pixel ${styles.text}`}>{video.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && selectedVideo && selectedPlatform && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-bold text-black font-pixel">
                  {selectedPlatform === 'instagram' ? '📷 Instagram' : '🎵 TikTok'} - {selectedVideo.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: '500px' }}>
                  <iframe
                    src={getEmbedUrl(selectedVideo.url, selectedPlatform)}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                </div>
                <div className="flex justify-center">
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-pixel"
                  >
                    {t('View on')} {selectedPlatform === 'instagram' ? 'Instagram' : 'TikTok'}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="mt-6 space-y-6">
        {/* Instagram Videos */}
        {instagramVideos.length > 0 && (
          <div>
            <h4 className={`text-lg font-bold mb-3 font-pixel ${styles.text}`}>
              📷 Instagram Reels ({instagramVideos.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {instagramVideos.map((video, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${styles.cardBg}`}
                  onClick={() => openVideoModal(video, 'instagram')}
                >
                  <div className="flex items-center justify-center h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg mb-2">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <p className={`text-center font-pixel ${styles.text}`}>{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TikTok Videos */}
        {tiktokVideos.length > 0 && (
          <div>
            <h4 className={`text-lg font-bold mb-3 font-pixel ${styles.text}`}>
              🎵 TikTok Videos ({tiktokVideos.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiktokVideos.map((video, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${styles.cardBg}`}
                  onClick={() => openVideoModal(video, 'tiktok')}
                >
                  <div className="flex items-center justify-center h-32 bg-gradient-to-br from-black to-red-500 rounded-lg mb-2">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <p className={`text-center font-pixel ${styles.text}`}>{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedVideo && selectedPlatform && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-black font-pixel">
                {selectedPlatform === 'instagram' ? '📷 Instagram' : '🎵 TikTok'} - {selectedVideo.title}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: '500px' }}>
                <iframe
                  src={getEmbedUrl(selectedVideo.url, selectedPlatform)}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </div>
              <div className="flex justify-center">
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-pixel"
                >
                  {t('View on')} {selectedPlatform === 'instagram' ? 'Instagram' : 'TikTok'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoGallery;