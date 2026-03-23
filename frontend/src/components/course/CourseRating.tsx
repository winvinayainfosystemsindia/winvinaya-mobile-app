import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Avatar, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider,
  CircularProgress
} from '@mui/material';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RatingEntry {
  id: number;
  rating: number;
  review?: string;
  user: {
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface CourseRatingProps {
  ratings: RatingEntry[];
  onRate: (rating: number, review?: string) => Promise<void>;
  loading?: boolean;
}

const CourseRating: React.FC<CourseRatingProps> = ({ ratings, onRate }) => {
  const [userRating, setUserRating] = useState<number | null>(0);
  const [userReview, setUserReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const averageRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const handleSubmit = async () => {
    if (!userRating) return;
    setSubmitting(true);
    try {
      await onRate(userRating, userReview);
      setUserReview('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Ratings & Reviews
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#fcfcfc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {averageRating}
            </Typography>
            <Rating value={Number(averageRating)} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary">
              {ratings.length} reviews
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Rate this course
            </Typography>
            <Rating 
              value={userRating} 
              onChange={(_, val) => setUserRating(val)} 
              size="large"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Tell us what you liked or how we can improve..."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              sx={{ mb: 2, bgcolor: '#fff' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
                onClick={handleSubmit}
                disabled={!userRating || submitting}
              >
                Submit Review
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <List sx={{ width: '100%' }}>
          {ratings.length > 0 ? (
            ratings.map((r, index) => (
              <React.Fragment key={r.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar alt={r.user.full_name} src={r.user.avatar_url}>
                      {r.user.full_name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {r.user.full_name}
                        </Typography>
                        <Rating value={r.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {formatDistanceToNow(new Date(r.created_at))} ago
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
                      >
                        {r.review}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < ratings.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No reviews yet. Be the first to share your experience!
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default CourseRating;
