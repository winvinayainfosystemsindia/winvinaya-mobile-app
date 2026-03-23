import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  TextField, 
  Button, 
  IconButton,
  Paper,
  Collapse
} from '@mui/material';
import { ThumbsUp, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DiscussionEntry {
  id: number;
  body: string;
  user: {
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  upvotes: number;
  replies?: DiscussionEntry[];
}

interface DiscussionThreadProps {
  discussions: DiscussionEntry[];
  onPost: (body: string, parentId?: number) => Promise<void>;
}

const CommentItem: React.FC<{ 
  comment: DiscussionEntry; 
  onReply: (body: string, parentId?: number) => Promise<void>;
  isReply?: boolean;
}> = ({ comment, onReply, isReply = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyBody.trim()) return;
    await onReply(replyBody, comment.id);
    setReplyBody('');
    setShowReplyForm(false);
    setShowReplies(true);
  };

  return (
    <Box sx={{ mb: 2, ml: isReply ? 4 : 0 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar 
          src={comment.user.avatar_url} 
          sx={{ width: isReply ? 32 : 40, height: isReply ? 32 : 40 }}
        >
          {comment.user.full_name[0]}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.user.full_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {formatDistanceToNow(new Date(comment.created_at))} ago
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
            {comment.body}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" sx={{ p: 0.5 }}>
                <ThumbsUp size={14} />
              </IconButton>
              <Typography variant="caption">{comment.upvotes}</Typography>
            </Box>
            
            {!isReply && (
              <Button 
                size="small" 
                startIcon={<MessageCircle size={14} />}
                onClick={() => setShowReplyForm(!showReplyForm)}
                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
              >
                Reply
              </Button>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <Button 
                size="small" 
                startIcon={showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                onClick={() => setShowReplies(!showReplies)}
                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
              >
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </Box>

          <Collapse in={showReplyForm}>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Write a reply..."
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleReplySubmit}
                disabled={!replyBody.trim()}
              >
                Post
              </Button>
            </Box>
          </Collapse>
        </Box>
      </Box>

      {comment.replies && (
        <Collapse in={showReplies}>
          <Box sx={{ mt: 2, borderLeft: '2px solid #f0f0f0' }}>
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} isReply />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const DiscussionThread: React.FC<DiscussionThreadProps> = ({ discussions, onPost }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await onPost(newComment);
    setNewComment('');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Discussion ({discussions.length})
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: '#fcfcfc' }}>
        <TextField 
          fullWidth 
          multiline 
          rows={3} 
          placeholder="Ask a question or share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2, bgcolor: '#fff' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            startIcon={<Send size={16} />}
            onClick={handleSubmit}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </Box>
      </Paper>

      <Box>
        {discussions.length > 0 ? (
          discussions.map(discussion => (
            <CommentItem 
              key={discussion.id} 
              comment={discussion} 
              onReply={onPost} 
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No discussions yet. Be the first to start the conversation!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DiscussionThread;
