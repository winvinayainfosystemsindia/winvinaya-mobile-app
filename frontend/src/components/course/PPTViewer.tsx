import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SlideData {
  id: number;
  slide_no: number;
  notes?: string;
  image_url: string;
}

interface PPTViewerProps {
  slides: SlideData[];
}

const PPTViewer: React.FC<PPTViewerProps> = ({ slides }) => {
  if (!slides || slides.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: '#666' }}>
        <Typography>No slides available for this presentation.</Typography>
      </Box>
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', bgcolor: '#f0f2f5', p: { xs: 1, md: 3 } }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Slider {...settings}>
          {slides.map((slide) => (
            <Box key={slide.id} sx={{ outline: 'none' }}>
              <Box 
                component="img"
                src={slide.image_url} 
                alt={`Slide ${slide.slide_no}`}
                sx={{ 
                  width: '100%', 
                  height: 'auto', 
                  boxShadow: 3, 
                  borderRadius: 1,
                  display: 'block' 
                }} 
              />
              {slide.notes && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #ddd' }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Notes</Typography>
                  <Typography variant="body2">{slide.notes}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute', right: -40, top: '40%', zIndex: 1,
        bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' }
      }}
    >
      <ChevronRight />
    </IconButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute', left: -40, top: '40%', zIndex: 1,
        bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' }
      }}
    >
      <ChevronLeft />
    </IconButton>
  );
};

export default PPTViewer;
