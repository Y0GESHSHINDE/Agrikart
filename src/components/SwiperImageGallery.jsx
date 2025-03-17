import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Thumbs, Keyboard, A11y } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';

// Image optimization utility
const optimizeImageSrc = (url, width = 800) => {
    if (!url) return null;
    try {
        const imageUrl = new URL(url);
        // Add optimization parameters based on URL structure
        imageUrl.searchParams.set('w', width.toString());
        imageUrl.searchParams.set('q', '80'); // quality
        imageUrl.searchParams.set('auto', 'format'); // auto format selection
        return {
            src: imageUrl.toString(),
            srcSet: `${imageUrl.toString()} ${width}w, ${url}?w=${width * 2}&q=80 ${width * 2}w`,
            sizes: '(max-width: 768px) 100vw, 800px'
        };
    } catch (e) {
        // If URL parsing fails, return original URL with basic optimization
        return {
            src: url,
            srcSet: `${url} ${width}w`,
            sizes: '(max-width: 768px) 100vw, 800px'
        };
    }
};

// Performance monitoring hook
// const usePerformanceMonitoring = () => {
//   useEffect(() => {
//     if ('PerformanceObserver' in window) {
//       const observer = new PerformanceObserver((list) => {
//         list.getEntries().forEach((entry) => {
//           console.log(`[Performance] ${entry.name}: ${entry.value}`);
//         });
//       });
//       observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
//       return () => observer.disconnect();
//     }
//   }, []);
// };

const SwiperImageGallery = ({ images = [], placeholderImage = "/placeholder.svg" }) => {
    const [mainSwiper, setMainSwiper] = useState(null);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const galleryRef = useRef(null);

    // Enable performance monitoring
    // usePerformanceMonitoring();

    // Calculate slidesPerView based on number of images
    const thumbSlidesPerView = Math.min(4, images.length);

    // Determine if we should enable loop mode
    const hasMultipleImages = images.length > 1;
    const enableThumbsLoop = images.length > thumbSlidesPerView;

    // Optimize and prepare images with fallback - memoized for performance
    const processedImages = useMemo(() =>
        images.map(img => optimizeImageSrc(img || placeholderImage)),
        [images, placeholderImage]
    );

    // Track zoom state for better announcements
    const handleZoomChange = useCallback((isZooming) => {
        setIsZoomed(isZooming);
        // Announce zoom state change to screen readers
        const message = isZooming ? "Image zoomed in" : "Image zoom reset";
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        galleryRef.current?.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }, []);

    // Custom navigation implementation
    const goToSlide = useCallback((index) => {
        if (!mainSwiper) return;

        // Ensure index is within bounds
        let targetIndex = index;
        if (targetIndex < 0) targetIndex = images.length - 1;
        if (targetIndex >= images.length) targetIndex = 0;

        // Go to the slide
        mainSwiper.slideTo(targetIndex);
        setActiveIndex(targetIndex);

        // Update thumbs swiper if available
        if (thumbsSwiper) {
            thumbsSwiper.slideTo(targetIndex);
        }
    }, [mainSwiper, thumbsSwiper, images.length]);

    const goNext = useCallback(() => {
        goToSlide(activeIndex + 1);
        // Focus management: return focus to the next button after operation
        setTimeout(() => nextButtonRef.current?.focus(), 100);
    }, [activeIndex, goToSlide]);

    const goPrev = useCallback(() => {
        goToSlide(activeIndex - 1);
        // Focus management: return focus to the prev button after operation
        setTimeout(() => prevButtonRef.current?.focus(), 100);
    }, [activeIndex, goToSlide]);

    // Handle slide change to update pagination
    const handleSlideChange = useCallback((swiper) => {
        const currentIndex = swiper.activeIndex % images.length;
        setActiveIndex(currentIndex);
    }, [images.length]);

    // Sync thumbs swiper when main swiper changes
    useEffect(() => {
        if (mainSwiper && thumbsSwiper) {
            mainSwiper.on('slideChange', () => {
                if (thumbsSwiper.activeIndex !== mainSwiper.activeIndex) {
                    thumbsSwiper.slideTo(mainSwiper.activeIndex);
                }
            });
        }
    }, [mainSwiper, thumbsSwiper]);

    // Keyboard event handler for gallery navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only handle keyboard events when the gallery is focused or one of its children is focused
            const galleryElement = document.activeElement;
            const isGalleryFocused = galleryElement &&
                (galleryElement.classList.contains('gallery-container') ||
                    galleryElement.closest('.gallery-container'));

            if (!isGalleryFocused) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    goPrev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    goNext();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goPrev, goNext]);

    // More efficient image error handling that directly sets the src
    const handleImageError = useCallback((e) => {
        e.target.src = placeholderImage;
        e.target.alt = "Image failed to load";
    }, [placeholderImage]);

    // Custom pagination component using Tailwind
    const renderCustomPagination = () => {
        if (!hasMultipleImages) return null;

        return (
            <div
                className="absolute bottom-0 left-0 right-0 z-10 my-[4%] flex justify-center rounded-b-xl md:my-[4%] lg:my-[2.5%] xl:my-[2%]"
                role="group"
                aria-label="Image pagination"
            >
                <div className="flex items-center space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={`pagination-dot-${index}`}
                            onClick={() => goToSlide(index)}
                            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === activeIndex
                                ? 'h-3 w-3 transform scale-110 bg-green-600'
                                : 'bg-gray-300 hover:bg-green-400/80'
                                }`}
                            aria-label={`Go to image ${index + 1} of ${images.length}`}
                            aria-current={index === activeIndex ? "true" : "false"}
                            type="button"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // If no images are provided, show placeholder
    if (!images.length) {
        return (
            <div
                className="flex h-[300px] w-full items-center justify-center rounded-xl bg-gray-100 sm:h-[400px] md:h-[500px]"
                role="region"
                aria-label="No images available"
            >
                <img
                    src={placeholderImage}
                    alt="No image available"
                    className="h-32 w-32 opacity-50"
                />
            </div>
        );
    }

    return (
        <div
            ref={galleryRef}
            className="gallery-container h-auto w-full"
            role="region"
            aria-label="Image gallery"
            tabIndex="0"
        >
            {/* Main Swiper */}
            <div className="relative">
                <Swiper
                    onSwiper={setMainSwiper}
                    modules={[Zoom, Thumbs, Keyboard, A11y]}
                    onSlideChange={handleSlideChange}
                    zoom={{
                        maxRatio: 3,
                        minRatio: 1,
                        toggle: true,
                        containerClass: 'swiper-zoom-container',
                        zoomedSlideClass: 'is-zoomed'
                    }}
                    keyboard={{
                        enabled: true,
                        onlyInViewport: true,
                    }}
                    a11y={{
                        enabled: true,
                        prevSlideMessage: 'Previous slide',
                        nextSlideMessage: 'Next slide',
                        firstSlideMessage: 'This is the first slide',
                        lastSlideMessage: 'This is the last slide',
                        paginationBulletMessage: 'Go to slide {{index}}',
                        slideLabelMessage: 'Slide {{index}} of {{slidesLength}}',
                        containerMessage: 'Image gallery carousel',
                        containerRoleDescriptionMessage: 'carousel'
                    }}
                    loop={false} // We'll handle looping manually
                    thumbs={{ swiper: thumbsSwiper || undefined }}
                    className="mb-4 h-auto rounded-xl"
                    allowTouchMove={true}
                    onZoomChange={({ isZooming }) => handleZoomChange(isZooming)}
                >
                    {processedImages.map((image, index) => (
                        <SwiperSlide
                            key={`main-slide-${index}`}
                            className="overflow-hidden"
                            role="group"
                            aria-label={`Image ${index + 1} of ${images.length}`}
                            aria-roledescription="slide"
                            aria-selected={index === activeIndex ? "true" : "false"}
                        >
                            <div
                                className="swiper-zoom-container"
                                onTouchStart={() => handleZoomChange(true)}
                                onTouchEnd={() => handleZoomChange(false)}
                            >
                                <img
                                    src={image.src}
                                    srcSet={image.srcSet}
                                    sizes={image.sizes}
                                    alt={`Image ${index + 1} - Click or use pinch gesture to zoom`}
                                    className="h-auto w-full object-cover sm:h-[23rem] md:h-[26rem]"
                                    onError={handleImageError}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchpriority={index === 0 ? "high" : "low"}
                                    decoding="async"
                                    style={{
                                        // contentVisibility: 'auto',
                                    }}
                                    onLoad={(e) => {
                                        if (index === 0) {
                                            // Mark the element for LCP monitoring
                                            e.target.setAttribute('data-lcp-candidate', 'true');
                                        }
                                    }}
                                />
                            </div>
                            {isZoomed && index === activeIndex && (
                                <div className="sr-only" aria-live="polite">
                                    Image is currently zoomed in. Use pinch gesture or double tap to zoom out.
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom pagination using Tailwind */}
                {renderCustomPagination()}

                {/* Custom navigation buttons - Only show if we have more than one image */}
                {hasMultipleImages && (
                    <>
                        <button
                            ref={prevButtonRef}
                            onClick={goPrev}
                            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 transition-all hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-200 sm:left-4 md:left-6 md:h-10 md:w-10"
                            aria-label="Previous image"
                            type="button"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" aria-hidden="true" />
                        </button>

                        <button
                            ref={nextButtonRef}
                            onClick={goNext}
                            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 transition-all hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-200 sm:right-4 md:right-6 md:h-10 md:w-10"
                            aria-label="Next image"
                            type="button"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbs Swiper - Only show if we have more than one image */}
            {hasMultipleImages && (
                <div
                    className="thumbnail-navigation"
                    role="region"
                    aria-label="Thumbnail navigation"
                >
                    <Swiper
                        modules={[Thumbs, A11y]}
                        watchSlidesProgress
                        slidesPerView={thumbSlidesPerView}
                        spaceBetween={10}
                        className="h-20"
                        onSwiper={setThumbsSwiper}
                        loop={false} // We'll handle looping manually
                        a11y={{
                            enabled: true,
                            prevSlideMessage: 'Previous thumbnails',
                            nextSlideMessage: 'Next thumbnails',
                        }}
                    >
                        {processedImages.map((image, index) => (
                            <SwiperSlide
                                key={`thumb-slide-${index}`}
                                className={`cursor-pointer overflow-hidden rounded-lg transition-all ${index === activeIndex
                                    ? 'border-2 border-green-500 shadow-md'
                                    : 'border-2 border-transparent hover:border-green-500'
                                    }`}
                                onClick={() => goToSlide(index)}
                                role="button"
                                aria-label={`Select image ${index + 1}`}
                                aria-current={index === activeIndex ? "true" : "false"}
                                tabIndex="0"
                            >
                                <img
                                    src={image.src}
                                    srcSet={image.srcSet}
                                    sizes={image.sizes}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="h-full w-full object-cover"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Screen reader only status message */}
            <div className="sr-only" aria-live="polite">
                {`Viewing image ${activeIndex + 1} of ${images.length}`}
            </div>
        </div>
    );
};

export default SwiperImageGallery;