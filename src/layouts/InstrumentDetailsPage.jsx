import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar/Navbar";
import {
  ChevronLeft,
  Star,
  Clock,
  Calendar,
  ZoomIn,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  MapPin,
  MessageSquare
} from 'lucide-react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="group flex items-center" role="group" aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform group-hover:scale-110" aria-hidden="true" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="h-4 w-4 text-yellow-400 transition-transform group-hover:scale-110" aria-hidden="true" />
          <div className="absolute left-0 top-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400 transition-transform group-hover:scale-110" aria-hidden="true" />
      ))}
      <span className="ml-1 text-sm text-gray-600 transition-opacity group-hover:opacity-100" aria-hidden="true">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef(null);
  const imageRef = React.useRef(null);

  const isZoomed = transform.scale > 1;
  const minZoom = 1;
  const maxZoom = 3;

  // Update image dimensions on load and resize
  const updateImageDimensions = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    
    const image = imageRef.current;
    const container = containerRef.current.getBoundingClientRect();
    
    // Clear dimensions and set loading state
    setImageDimensions({ width: 0, height: 0 });
    
    // Cancel any previous in-flight dimension calculations
    if (image.complete) {
      calculateDimensions();
    } else {
      const handleLoad = () => {
        calculateDimensions();
        image.removeEventListener('load', handleLoad);
      };
      image.addEventListener('load', handleLoad);
    }
    
    function calculateDimensions() {
      // Get natural dimensions directly from the loaded image
      const naturalWidth = image.naturalWidth || container.width;
      const naturalHeight = image.naturalHeight || container.height;
      const aspectRatio = naturalWidth / naturalHeight;
      const containerAspectRatio = container.width / container.height;
      
      let width = container.width;
      let height = container.height;
      
      // Calculate optimal dimensions maintaining aspect ratio
      if (aspectRatio > containerAspectRatio) {
        height = width / aspectRatio;
        
        // Center vertically if image height is less than container
        if (height < container.height) {
          const verticalPadding = (container.height - height) / 2;
          height = container.height;
          width = height * aspectRatio;
        }
      } else {
        width = height * aspectRatio;
        
        // Center horizontally if image width is less than container
        if (width < container.width) {
          const horizontalPadding = (container.width - width) / 2;
          width = container.width;
          height = width / aspectRatio;
        }
      }
      
      // Update dimensions with a slight delay to ensure smooth transitions
      requestAnimationFrame(() => {
        setImageDimensions({ width, height });
      });
    }
  }, []);

  // Constrain pan bounds
  const constrainPan = useCallback((x, y, scale) => {
    if (!imageDimensions.width || !imageDimensions.height) return { x, y };
    const maxX = Math.max((imageDimensions.width * scale - imageDimensions.width) / 2, 0);
    const maxY = Math.max((imageDimensions.height * scale - imageDimensions.height) / 2, 0);
    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY)
    };
  }, [imageDimensions]);

  const handleZoom = useCallback((deltaY, clientX, clientY) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Dynamic zoom speed based on current scale and change rate
    const baseZoomFactor = deltaY > 0 ? 0.90 : 1.10;
    const dynamicFactor = 1 + Math.min(0.2, Math.abs(deltaY) / 500);
    const zoomFactor = Math.pow(baseZoomFactor, dynamicFactor);

    // Apply scale limits with smooth transition near bounds
    const rawNewScale = transform.scale * zoomFactor;
    const boundaryPadding = 0.1;
    
    let newScale;
    if (rawNewScale < minZoom + boundaryPadding) {
      newScale = minZoom;
    } else if (rawNewScale > maxZoom - boundaryPadding) {
      newScale = maxZoom;
    } else {
      newScale = rawNewScale;
    }

    // Reset transform with smooth animation when at minimum zoom
    if (newScale === minZoom) {
      const transitionDuration = 300;
      const startTime = Date.now();
      const startTransform = { ...transform };
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        
        const currentScale = startTransform.scale + (minZoom - startTransform.scale) * easeProgress;
        const currentX = startTransform.x * (1 - easeProgress);
        const currentY = startTransform.y * (1 - easeProgress);
        
        setTransform({ scale: currentScale, x: currentX, y: currentY });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
      return;
    }

    // Enhanced zoom point calculation with momentum
    const scaleChange = newScale / transform.scale;
    const zoomMomentum = Math.min(1, Math.abs(scaleChange - 1) * 2);
    
    const dx = (mouseX - transform.x);
    const dy = (mouseY - transform.y);
    const newX = mouseX - dx * scaleChange * (1 + zoomMomentum * 0.1);
    const newY = mouseY - dy * scaleChange * (1 + zoomMomentum * 0.1);

    // Apply constraints with smooth boundary behavior
    const { x: constrainedX, y: constrainedY } = constrainPan(newX, newY, newScale);

    // Schedule update with animation frame for smooth rendering
    requestAnimationFrame(() => {
      setTransform({
        scale: newScale,
        x: constrainedX,
        y: constrainedY
      });
    });
  }, [transform, constrainPan, minZoom, maxZoom]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    handleZoom(e.deltaY, e.clientX, e.clientY);
  }, [handleZoom]);

  const handleDragStart = useCallback((e) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
  }, [isZoomed, transform]);

  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const momentumFrameRef = useRef(null);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const now = Date.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    
    // Calculate velocity
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    velocityRef.current = {
      x: dx / dt,
      y: dy / dt
    };
    
    // Update position tracking
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = now;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Apply velocity-based movement
    const velocityFactor = Math.min(1, dt / 16);
    const vx = velocityRef.current.x * velocityFactor;
    const vy = velocityRef.current.y * velocityFactor;

    const { x: constrainedX, y: constrainedY } = constrainPan(
      newX + vx,
      newY + vy,
      transform.scale
    );

    requestAnimationFrame(() => {
      setTransform(prev => ({ ...prev, x: constrainedX, y: constrainedY }));
    });
  }, [isDragging, dragStart, constrainPan, transform.scale]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    const velocity = velocityRef.current;
    const speed = Math.hypot(velocity.x, velocity.y);
    
    // Apply momentum if speed is significant
    if (speed > 0.1) {
      let currentVelocity = { ...velocity };
      let lastTimestamp = Date.now();
      
      const applyMomentum = () => {
        const now = Date.now();
        const deltaTime = now - lastTimestamp;
        lastTimestamp = now;
        
        // Apply friction
        const friction = 0.95;
        currentVelocity.x *= friction;
        currentVelocity.y *= friction;
        
        const newX = transform.x + currentVelocity.x * deltaTime;
        const newY = transform.y + currentVelocity.y * deltaTime;
        
        const { x: constrainedX, y: constrainedY } = constrainPan(
          newX,
          newY,
          transform.scale
        );
        
        setTransform(prev => ({
          ...prev,
          x: constrainedX,
          y: constrainedY
        }));
        
        // Continue momentum until velocity is negligible
        if (Math.hypot(currentVelocity.x, currentVelocity.y) > 0.01) {
          momentumFrameRef.current = requestAnimationFrame(applyMomentum);
        }
      };
      
      momentumFrameRef.current = requestAnimationFrame(applyMomentum);
    }
    
    setIsDragging(false);
    velocityRef.current = { x: 0, y: 0 };
  }, [isDragging, transform.scale, transform.x, transform.y, constrainPan]);

  const handleDoubleClick = useCallback((e) => {
    if (isZoomed) {
      setTransform({ scale: minZoom, x: 0, y: 0 });
    } else {
      handleZoom(-1, e.clientX, e.clientY);
    }
  }, [isZoomed, handleZoom, minZoom]);

  const handleKeyDown = useCallback((e) => {
    if (!isZoomed) return;
    const STEP = 30;
    const { x, y, scale } = transform;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const newXLeft = x + STEP;
        const { x: constrainedXLeft } = constrainPan(newXLeft, y, scale);
        setTransform(prev => ({ ...prev, x: constrainedXLeft }));
        break;
      case 'ArrowRight':
        e.preventDefault();
        const newXRight = x - STEP;
        const { x: constrainedXRight } = constrainPan(newXRight, y, scale);
        setTransform(prev => ({ ...prev, x: constrainedXRight }));
        break;
      case 'ArrowUp':
        e.preventDefault();
        const newYUp = y + STEP;
        const { y: constrainedYUp } = constrainPan(x, newYUp, scale);
        setTransform(prev => ({ ...prev, y: constrainedYUp }));
        break;
      case 'ArrowDown':
        e.preventDefault();
        const newYDown = y - STEP;
        const { y: constrainedYDown } = constrainPan(x, newYDown, scale);
        setTransform(prev => ({ ...prev, y: constrainedYDown }));
        break;
      case '+':
        e.preventDefault();
        handleZoom(-1, imageDimensions.width / 2, imageDimensions.height / 2);
        break;
      case '-':
        e.preventDefault();
        handleZoom(1, imageDimensions.width / 2, imageDimensions.height / 2);
        break;
    }
  }, [isZoomed, transform, constrainPan, handleZoom, imageDimensions]);

  // Handle window resize
  useEffect(() => {
    updateImageDimensions();
    const handleResize = () => {
      updateImageDimensions();
      setTransform({ scale: 1, x: 0, y: 0 });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateImageDimensions]);

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update dimensions when image changes
  useEffect(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
    updateImageDimensions();
  }, [currentIndex, updateImageDimensions]);

  // Touch event handlers with proper memoization and constraints
  // Touch gesture state management
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const touchTimeoutRef = useRef(null);
  const lastTouchDistance = useRef(0);
  const touchVelocityRef = useRef({ x: 0, y: 0 });
  const lastTouchPosRef = useRef({ x: 0, y: 0 });
  const touchStartTimeRef = useRef(0);
  
  const handleTouchStart = useCallback((e) => {
    const now = Date.now();
    touchStartTimeRef.current = now;
    const timeDiff = now - lastTouchTime;
    
    // Enhanced double tap detection with position check
    if (timeDiff < 300 && e.touches.length === 1) {
      const touch = e.touches[0];
      const lastPos = lastTouchPosRef.current;
      const distanceSquared = Math.pow(touch.clientX - lastPos.x, 2) +
                             Math.pow(touch.clientY - lastPos.y, 2);
      
      if (distanceSquared < 100) { // Within 10px radius
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
          touchTimeoutRef.current = null;
        }
        e.preventDefault();
        handleDoubleClick(e.touches[0]);
        return;
      }
    }
    
    // Update last touch position
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
    }
    
    setLastTouchTime(now);
    touchVelocityRef.current = { x: 0, y: 0 };
    
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      lastTouchDistance.current = distance;
      setDragStart({
        x: distance,
        y: transform.scale,
        centerX,
        centerY,
        timestamp: now
      });
    } else if (e.touches.length === 1 && isZoomed) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - transform.x,
        y: touch.clientY - transform.y,
        timestamp: now
      });
    }
  }, [isZoomed, transform, lastTouchTime, handleDoubleClick]);

  const handleTouchMove = useCallback((e) => {
    if (!dragStart.timestamp) return;
    
    const now = Date.now();
    const timeDiff = now - dragStart.timestamp;
    
    // Ignore quick unintentional movements
    if (timeDiff < 16) return;
    
    e.preventDefault();
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Smooth out abrupt zoom changes
      const distance = lastTouchDistance.current;
      const smoothedDistance = distance + (newDistance - distance) * 0.1;
      lastTouchDistance.current = smoothedDistance;
      
      const scale = Math.min(
        Math.max((smoothedDistance / dragStart.x) * dragStart.y, minZoom),
        maxZoom
      );
      
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      const deltaX = centerX - dragStart.centerX;
      const deltaY = centerY - dragStart.centerY;
      
      const { x: constrainedX, y: constrainedY } = constrainPan(
        transform.x + deltaX,
        transform.y + deltaY,
        scale
      );
      
      requestAnimationFrame(() => {
        setTransform(prev => ({
          ...prev,
          scale,
          x: constrainedX,
          y: constrainedY
        }));
      });
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      const { x: constrainedX, y: constrainedY } = constrainPan(newX, newY, transform.scale);
      
      requestAnimationFrame(() => {
        setTransform(prev => ({ ...prev, x: constrainedX, y: constrainedY }));
      });
    }
  }, [isDragging, dragStart, transform.scale, transform.x, transform.y, constrainPan, minZoom, maxZoom]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.src = "/placeholder.svg";
  }, []);

  const resetZoomState = useCallback(() => {
    setTransform({ scale: minZoom, x: 0, y: 0 });
    setIsDragging(false);
    updateImageDimensions();
  }, [minZoom, updateImageDimensions]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoomState();
  }, [images.length, resetZoomState]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoomState();
  }, [images.length, resetZoomState]);

  // Add event listeners
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cleanup = () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return cleanup;
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className={`relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl
          ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <div className="relative h-full w-full">
          <img
            ref={imageRef}
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Image ${currentIndex + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
              transformOrigin: '0 0'
            }}
            draggable="false"
            onError={handleImageError}
            onLoad={updateImageDimensions}
          />
          {/* Loading overlay */}
          {!imageDimensions.width && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            </div>
          )}
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300
          ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:left-4 sm:p-1.5 xl:p-2"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:right-4 sm:p-1.5 xl:p-2"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isZoomed) {
              setTransform({ scale: minZoom, x: 0, y: 0 });
            } else {
              const rect = imageRef.current.getBoundingClientRect();
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              handleZoom(-1, rect.left + centerX, rect.top + centerY);
            }
          }}
          className={`absolute bottom-2 right-2 rounded-full bg-black/50 p-1.5 text-white transition-all hover:scale-110 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:bottom-4 sm:right-4 sm:p-2 ${
            isZoomed ? 'bg-green-600/70 hover:bg-green-700/70' : ''
          }`}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <ZoomIn className={`h-5 w-5 sm:h-6 sm:w-6 transform transition-transform ${isZoomed ? 'rotate-45' : ''}`} />
        </button>
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 transition-all duration-300 rounded-full
              ${idx === currentIndex ? 'w-6 bg-green-600' : 'w-2 bg-gray-300'}
              hover:bg-green-500`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const sampleInstrument = {
  id: 1,
  name: "Heavy Duty Tractor",
  category: "Tractors",
  price: 45000,
  hourlyRate: 450,
  dailyRate: 4500,
  weeklyRate: 25000,
  condition: "New",
  rating: 4.7,
  images: [
    "https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=700&h=600&dpr=1",
    "https://images.pexels.com/photos/2253359/pexels-photo-2253359.jpeg?auto=compress&cs=tinysrgb&w=700&h=600&dpr=1",
    "https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg?auto=compress&cs=tinysrgb&w=700&h=600&dpr=1",
    "https://images.pexels.com/photos/2889442/pexels-photo-2889442.jpeg?auto=compress&cs=tinysrgb&w=700&h=600&dpr=1"
  ],
  description: "Powerful tractor suitable for large farms with advanced features and high durability. Perfect for heavy-duty agricultural work and efficient field operations.",
  specifications: {
    engineType: "4-Cylinder Diesel",
    transmission: "Synchromesh",
    liftingCapacity: "2000 kg",
    fuelTankCapacity: "60 L",
    horsePower: "75 HP",
    engineDisplacement: "4000 cc"
  },
  features: [
    "Power steering",
    "4-wheel drive",
    "Digital instrument cluster",
    "Climate controlled cabin",
    "GPS navigation",
    "Auto-tilling system"
  ],
  owner: {
    name: "Raj Kumar",
    rating: 4.8,
    responseTime: "Within 2 hours",
    memberSince: "2023",
    location: "Sangamner, India"
  }
};

export default function InstrumentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const instrument = sampleInstrument;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/80 pb-12">
      <Navbar />

      {/* Sticky Header */}
      <div className={`sticky top-0 z-20 transition-all duration-300 ${isHeaderSticky ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-transparent'}`}>
        <div className="container mx-auto w-full px-4 py-4">
          <button
            onClick={() => navigate('/Listed-instruments')}
            className="flex items-center text-green-700 transition-colors hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Back to instrument listings"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium">Back to Listings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="space-y-8">
          {/* Image Gallery - Full width */}
          <div className="rounded-2xl bg-white p-3 shadow-lg transition-shadow hover:shadow-xl sm:p-6">
            <ImageGallery images={instrument.images} />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {/* Left Column - Basic Info & Rental Rates */}
            <div className="w-full space-y-6">
              {/* Basic Info */}
              <section className="rounded-2xl bg-white p-4 shadow-lg transition-all hover:shadow-xl sm:p-6"
                aria-labelledby="instrument-title">
                <div className='mb-4 w-full'>
                  <div className='flex w-full justify-between'>
                    <h1 id="instrument-title"
                      className="w-3/4 text-xl font-bold text-gray-900 sm:text-2xl md:text-[1.7rem] lg:text-3xl">
                      {instrument.name}
                    </h1>
                    <span className="inline-flex h-fit w-fit rounded-lg bg-green-100 px-2 py-1 text-sm font-medium text-green-800 shadow-sm ring-1 ring-inset ring-green-200 sm:px-4 sm:py-1.5"
                      role="status">
                      {instrument.condition}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="flex items-center text-xs text-gray-600 sm:text-sm">
                      <MapPin className="mr-1 h-4 w-4" />
                      {instrument.owner.location}
                    </span>
                    <span className="text-base text-gray-500">|</span>
                    <StarRating rating={instrument.rating} />
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-lg">{instrument.description}</p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:flex-row">
                  <p
                    className="text-xl font-bold text-green-700 sm:text-[1.6rem]"
                    aria-label={`Price: ₹${instrument.price.toLocaleString()}`}
                  >
                    ₹{instrument.price.toLocaleString()}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 md:flex-nowrap xl:w-fit">
                    <button
                      className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:flex-none sm:px-5 sm:py-2 sm:text-base"
                      aria-label="Rent this instrument now"
                    >
                      Rent Now
                    </button>
                    <button
                      className="flex-1 rounded-lg border-2 border-green-600 px-3 py-2 text-sm font-semibold text-green-600 transition-all hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:flex-none sm:px-5 sm:py-2 sm:text-base"
                      aria-label="Contact owner"
                    >
                      <MessageSquare className="mr-2 inline-block h-4 w-4 sm:h-5 sm:w-5" />
                      Contact
                    </button>
                  </div>
                </div>
              </section>

              {/* Rental Rates */}
              <section
                className="rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
                aria-labelledby="rental-rates-title"
              >
                <h2 id="rental-rates-title" className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl md:text-2xl">
                  Rental Rates
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:gap-4">
                  {[
                    { icon: Clock, label: 'Hourly', rate: instrument.hourlyRate, unit: 'hr' },
                    { icon: Calendar, label: 'Daily', rate: instrument.dailyRate, unit: 'day' },
                    { icon: Calendar, label: 'Weekly', rate: instrument.weeklyRate, unit: 'week' }
                  ].map(({ icon: Icon, label, rate, unit }) => (
                    <div
                      key={label}
                      className="flex items-center rounded-xl border border-gray-200 p-3 shadow-sm transition-all hover:border-green-500 hover:shadow-md sm:p-4"
                      role="listitem"
                    >
                      <Icon className="mr-2 h-6 w-6 text-green-600 sm:mr-3 sm:h-8 sm:w-8" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-medium text-gray-600 sm:text-sm">{label} Rate</p>
                        <p
                          className="text-base font-semibold text-gray-900 sm:text-lg"
                          aria-label={`${label} rate: ₹${rate} per ${unit}`}
                        >
                          ₹{rate}/{unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column - Specifications & Features */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Specifications */}
              <section
                className="w-full rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
                aria-labelledby="specifications-title"
              >
                <h2 id="specifications-title" className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
                  Specifications
                </h2>
                <div className="space-y-3 sm:space-y-4" role="list" aria-label="Specifications list">
                  {Object.entries(instrument.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-gray-200 pb-2 transition-colors hover:border-green-200"
                      role="listitem"
                    >
                      <span className="text-sm text-gray-600 sm:text-base">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section
                className="rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 md:w-full"
                aria-labelledby="features-title"
              >
                <h2 id="features-title" className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
                  Features
                </h2>
                <div className="grid grid-cols-1 gap-3" role="list" aria-label="Features list">
                  {instrument.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 transition-all hover:border-green-200 hover:bg-green-50/30 sm:p-3"
                      role="listitem"
                    >
                      <span className="mr-2 h-2 w-2 rounded-full bg-green-500 sm:mr-3"></span>
                      <span className="text-sm text-gray-700 sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Owner Information */}
            <section
              className="w-full rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
              aria-labelledby="owner-info-title"
            >
              <h2 id="owner-info-title" className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
                Owner Information
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <span className="text-lg font-semibold text-green-700">
                        {instrument.owner.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{instrument.owner.name}</h3>
                      <StarRating rating={instrument.owner.rating} />
                    </div>
                  </div>
                  <p className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-5 w-5 text-green-600" />
                    {instrument.owner.location}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-start space-x-2">
                    <span className="text-gray-600">Response Time: </span>
                    <span className="font-medium text-gray-900">{instrument.owner.responseTime}</span>
                  </div>
                  <div className="flex justify-start space-x-2">
                    <span className="text-gray-600">Member Since: </span>
                    <span className="font-medium text-gray-900">{instrument.owner.memberSince}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Similar Instruments Section */}
          <div className="rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
              Similar Instruments
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-lg border border-gray-100 bg-gray-50/30 p-3 transition-all hover:border-green-200 hover:bg-white hover:shadow-md">
                  <div key={item} className='flex space-x-4'>
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={instrument.images[item % instrument.images.length]}
                        alt={`Similar Tractor ${item}`}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-gray-900 transition-colors hover:text-green-600">
                        Premium Tractor Model {item}
                      </h3>
                      <div className="mt-1 flex items-baseline space-x-2">
                        <p className="text-base font-semibold text-green-600">₹{(40000 + item * 5000).toLocaleString()}</p>
                        <span className="text-sm text-gray-500">/week</span>
                      </div>
                      <div className="mt-2 flex flex-col justify-between sm:flex-row sm:items-center">
                        <StarRating rating={4.5 + item * 0.1} />
                      </div>
                    </div>
                  </div>
                  <p className='mr-auto mt-2 flex items-center justify-end gap-2 text-sm text-gray-600'>
                    <MapPin className='h-4 w-4 text-green-600' />
                    <span className='text-gray-600'>Sangamner, India</span>
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border-2 border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition-all hover:bg-green-50">
              View More Similar Items
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
