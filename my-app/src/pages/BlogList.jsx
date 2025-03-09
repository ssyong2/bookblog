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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getPosts, deletePost } from '../utils/storage';
import BlogPost from './BlogPost';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      deletePost(id);
      setPosts(getPosts());
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPost(null);
  };

  const getDisplayImage = (post) => {
    if (post.thumbnailImage) {
      return post.thumbnailImage;
    }
    if (post.images && post.images.length > 0) {
      return post.images[0];
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', p: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 4,
        mt: '32px',
        px: { xs: '16px', md: 0 },
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
        width: '100%'
      }}>
        <Typography variant="h4" component="h1" gutterBottom={isMobile}>
          나의 독서 블로그
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/write')}
          fullWidth={isMobile}
        >
          새 글 작성
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        width: '100%',
        px: { xs: 0, md: 0 }
      }}>
        {posts.map((post, index) => (
          <Box 
            key={post.id} 
            sx={{ 
              width: { 
                xs: '100%', 
                sm: 'calc(50% - 8px)', 
                md: 'calc(33.333% - 11px)' 
              }, 
              mb: { xs: '16px' },
              mr: { 
                sm: (index + 1) % 2 === 0 ? 0 : '16px', 
                md: (index + 1) % 3 === 0 ? 0 : '16px'
              },
              boxSizing: 'border-box'
            }}
          >
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                width: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => handlePostClick(post)}
            >
              {getDisplayImage(post) && (
                <CardMedia
                  component="img"
                  height={isMobile ? "250" : "200"}
                  image={getDisplayImage(post)}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
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
              <CardActions sx={{ justifyContent: isMobile ? 'flex-end' : 'flex-start', p: 1 }}>
                <Button size="small" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit/${post.id}`);
                }}>
                  수정
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                >
                  삭제
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
        {posts.length === 0 && (
          <Box sx={{ width: '100%', py: 4, px: { xs: '16px', md: 0 } }}>
            <Typography variant="h6" align="center" color="text.secondary">
              아직 작성된 글이 없습니다.
            </Typography>
          </Box>
        )}
      </Box>

      <BlogPost
        post={selectedPost}
        open={openModal}
        onClose={handleCloseModal}
        onDelete={() => setPosts(getPosts())}
      />
    </Box>
  );
} 