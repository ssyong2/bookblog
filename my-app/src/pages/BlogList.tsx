import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BlogPost } from '../types/blog';
import { getPosts, deletePost } from '../utils/storage';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      deletePost(id);
      setPosts(getPosts());
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          나의 독서 블로그
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/write')}
        >
          새 글 작성
        </Button>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {post.thumbnailImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.thumbnailImage}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom noWrap>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  작성일: {new Date(post.createdAt).toLocaleDateString()}
                  {post.updatedAt !== post.createdAt && 
                    ` (수정됨: ${new Date(post.updatedAt).toLocaleDateString()})`}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.content}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/post/${post.id}`)}>
                  자세히 보기
                </Button>
                <Button size="small" onClick={() => navigate(`/edit/${post.id}`)}>
                  수정
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(post.id)}
                >
                  삭제
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {posts.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="text.secondary">
              아직 작성된 글이 없습니다.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 