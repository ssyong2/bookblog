import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Paper,
  Container,
  Divider,
} from '@mui/material';
import { BlogPost } from '../types/blog';
import { getPost, deletePost } from '../utils/storage';

export default function BlogPostDetail() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundPost = getPost(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (id && window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      deletePost(id);
      navigate('/');
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            작성일: {new Date(post.createdAt).toLocaleDateString()}
            {post.updatedAt !== post.createdAt &&
              ` (수정됨: ${new Date(post.updatedAt).toLocaleDateString()})`}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
            {post.content}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/edit/${id}`)}
            >
              수정하기
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              삭제하기
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')}
            >
              목록으로
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 