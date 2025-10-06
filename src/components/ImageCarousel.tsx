import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  } from '@mui/icons-material';

interface CarouselImage {
  id: number;
  src: string;
  title: string;
  description: string;
  beforeSize?: string;
  afterSize?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoPlay = true,
  autoPlayInterval = 4000,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (images.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 300, sm: 400, md: 500 },
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 25px 80px rgba(139, 92, 246, 0.4)'
          : '0 25px 80px rgba(139, 92, 246, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          background: 'linear-gradient(45deg, #8B5CF6, #D946EF, #8B5CF6)',
          borderRadius: 3,
          zIndex: -1,
          animation: 'borderGlow 3s ease-in-out infinite',
        },
        '@keyframes borderGlow': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 0.8 },
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <Box
            key={image.id}
            sx={{
              minWidth: '100%',
              height: '100%',
              position: 'relative',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Image */}
            <Box
              component="img"
              src={image.src}
              alt={image.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.6)',
                transform: currentIndex === index ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            
            {/* Floating Particles */}
            {currentIndex === index && (
              <>
                {[...Array(6)].map((_, particleIndex) => (
                  <Box
                    key={particleIndex}
                    sx={{
                      position: 'absolute',
                      width: { xs: 4, sm: 6 },
                      height: { xs: 4, sm: 6 },
                      bgcolor: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: '50%',
                      animation: `float${particleIndex} 4s ease-in-out infinite`,
                      [`@keyframes float${particleIndex}`]: {
                        '0%, 100%': {
                          transform: `translateY(0px) translateX(${particleIndex * 20}px)`,
                          opacity: 0.3,
                        },
                        '50%': {
                          transform: `translateY(-20px) translateX(${particleIndex * 25}px)`,
                          opacity: 0.8,
                        },
                      },
                      top: `${20 + particleIndex * 10}%`,
                      left: `${10 + particleIndex * 15}%`,
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Overlay Content */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.7), rgba(217, 70, 239, 0.5))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                p: { xs: 2, sm: 4 },
              }}
            >
              <Typography
                variant={isMobile ? 'h4' : 'h2'}
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  animation: currentIndex === index ? 'fadeInUp 0.8s ease-out' : 'none',
                  '@keyframes fadeInUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(30px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                {image.title}
              </Typography>
              
              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                sx={{
                  color: 'white',
                  mb: 3,
                  maxWidth: '600px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  animation: currentIndex === index ? 'fadeInUp 0.8s ease-out 0.2s both' : 'none',
                }}
              >
                {image.description}
              </Typography>

              {image.beforeSize && image.afterSize && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    animation: currentIndex === index ? 'fadeInUp 0.8s ease-out 0.4s both' : 'none',
                  }}
                >
                  <Card
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      p: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: currentIndex === index ? 'shimmer 2s ease-in-out 1s infinite' : 'none',
                      },
                      '@keyframes shimmer': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' },
                      },
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>
                      Before
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {image.beforeSize}
                    </Typography>
                  </Card>
                  
                  <Card
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      p: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: currentIndex === index ? 'shimmer 2s ease-in-out 1.5s infinite' : 'none',
                      },
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>
                      After
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {image.afterSize}
                    </Typography>
                  </Card>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      {!isMobile && (
        <>
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              opacity: isHovered ? 1 : 0.7,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-50%) scale(1.1)',
              },
            }}
          >
            <ArrowBackIos />
          </IconButton>
          
          <IconButton
            onClick={goToNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              opacity: isHovered ? 1 : 0.7,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-50%) scale(1.1)',
              },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: currentIndex === index ? 'scale(1.2)' : 'scale(1)',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.1)',
              },
            }}
          />
        ))}
      </Box>

      {/* Progress Bar */}
      {autoPlay && !isHovered && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 4,
            bgcolor: 'rgba(139, 92, 246, 0.3)',
            width: '100%',
          }}
        >
          <Box
            sx={{
              height: '100%',
              bgcolor: '#8B5CF6',
              borderRadius: '0 2px 2px 0',
              animation: `progress ${autoPlayInterval}ms linear infinite`,
              '@keyframes progress': {
                '0%': { width: '0%' },
                '100%': { width: '100%' },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageCarousel;
