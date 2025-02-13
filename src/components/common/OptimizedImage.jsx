import React, { useState, useEffect } from "react";
import { useOptimizedImage } from "../../hooks/useOptimizedImage";
import supabase from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';

// Create a loading state cache to prevent multiple loading states for the same image
const loadingCache = new Map();

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  objectFit = "cover",
  quality,
  imageWidth,
  fallbackSrc = '/default-profile.jpg'
}) => {
  const optimizedSrc = useOptimizedImage(src, {
    width: imageWidth || width,
    quality: quality || 75,
  });

  const [isLoading, setIsLoading] = useState(() => {
    // Check if we already have this image loaded
    return !loadingCache.has(optimizedSrc);
  });
  const [error, setError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // If the image is already loaded in cache, skip loading state
    if (loadingCache.has(optimizedSrc)) {
      setIsLoading(false);
      return;
    }

    // Preload the image
    const img = new Image();
    img.src = optimizedSrc;

    img.onload = () => {
      setIsLoading(false);
      loadingCache.set(optimizedSrc, true);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [optimizedSrc]);

  useEffect(() => {
    const fetchImage = async () => {
      // Reset error state at start of each fetch
      setError(false);
      
      // Don't treat empty src as error - just skip validation
      if (!src || src === fallbackSrc) {
        return;
      }

      try {
        // Only validate actual URLs
        if (!src.startsWith('http')) {
          return;
        }

        // Try to fetch the image
        const response = await fetch(src);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setError(true);
      }
    };

    fetchImage();
  }, [src, fallbackSrc]);

  const handleError = () => {
    // Only set error if we have a non-empty src that isn't the fallback
    if (!error && src && src !== fallbackSrc) {
      setError(true);
    }
  };

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <img
        src={src || fallbackSrc}
        alt={alt}
        width="100%"
        height="100%"
        loading="lazy"
        style={{
          objectFit,
          width: "100%",
          height: "100%",
          display: "block",
        }}
        className={`
          transition-opacity duration-300 w-full h-full
          ${isLoading ? "opacity-0" : "opacity-100"}
        `}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
