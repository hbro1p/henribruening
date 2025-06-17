
import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSettings } from '@/contexts/SettingsContext';

interface VideoUploadProps {
  onUploadComplete: () => void;
  theme: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete, theme }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useSettings();

  const getThemeStyles = () => {
    if (theme === 'space-mood') {
      return {
        container: 'bg-purple-50 border-purple-600',
        text: 'text-purple-900',
        button: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 hover:from-purple-400 hover:via-purple-500 hover:to-purple-700 text-white',
        dragActive: 'border-purple-400 bg-purple-100',
        dragInactive: 'border-purple-300 hover:border-purple-400',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        container: 'bg-gray-800 border-white/20',
        text: 'text-white',
        button: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 hover:from-purple-400 hover:via-purple-500 hover:to-purple-700 text-white',
        dragActive: 'border-green-400 bg-gray-700',
        dragInactive: 'border-white/30 hover:border-white/50',
      };
    }
    
    if (theme === 'retro-chrome') {
      return {
        container: 'bg-slate-800 border-blue-400/30',
        text: 'text-blue-200',
        button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
        dragActive: 'border-blue-400 bg-slate-700',
        dragInactive: 'border-blue-400/30 hover:border-blue-400/50',
      };
    }
    
    // Default fallback
    return {
      container: 'bg-white border-black',
      text: 'text-black',
      button: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-black/30 text-black hover:from-gray-200 hover:via-gray-300 hover:to-gray-500',
      dragActive: 'border-gray-600 bg-gray-100',
      dragInactive: 'border-gray-400 hover:border-gray-600',
    };
  };

  const styles = getThemeStyles();

  const isVideoFile = (file: File): boolean => {
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    return videoTypes.includes(file.type);
  };

  const handleFileUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (!isVideoFile(file)) {
      setUploadStatus('error');
      setErrorMessage('Please upload a valid video file (MP4, WebM, MOV, or AVI)');
      return;
    }

    if (file.size > 104857600) { // 100MB
      setUploadStatus('error');
      setErrorMessage('File size must be less than 100MB');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;

      console.log(`Uploading video: ${fileName}`);

      const { data, error } = await supabase.storage
        .from('tv')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        setUploadStatus('error');
        setErrorMessage(error.message);
        return;
      }

      console.log('Upload successful:', data);
      setUploadStatus('success');
      setUploadProgress(100);
      
      // Call the callback to refresh the video list
      setTimeout(() => {
        onUploadComplete();
        setUploadStatus('idle');
        setUploadProgress(null);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage('Upload failed. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className={`p-4 border-2 rounded-lg mb-6 ${styles.container}`}>
      <h3 className={`text-lg font-pixel mb-4 ${styles.text}`}>
        📁 Upload Videos
      </h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging ? styles.dragActive : styles.dragInactive
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploadStatus === 'uploading' ? (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-current border-t-transparent rounded-full animate-spin mx-auto" />
            <p className={`font-pixel ${styles.text}`}>Uploading...</p>
            {uploadProgress !== null && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="space-y-2">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className={`font-pixel ${styles.text}`}>Upload Complete!</p>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="space-y-2">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <p className={`font-pixel text-red-500`}>Upload Failed</p>
            <p className={`text-sm ${styles.text}`}>{errorMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className={`w-16 h-16 mx-auto ${styles.text}`} />
            <div>
              <p className={`font-pixel mb-2 ${styles.text}`}>
                Drop video files here or click to browse
              </p>
              <p className={`text-sm ${styles.text} opacity-70`}>
                Supports MP4, WebM, MOV, AVI (max 100MB)
              </p>
            </div>
            
            <label>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              <span className={`inline-block px-6 py-3 rounded cursor-pointer font-pixel transition-all ${styles.button}`}>
                Choose Files
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
