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
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { getPosts, deletePost, getDrafts, deleteDraft } from '../utils/storage';
import BlogPost from './BlogPost';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [openDraftsDialog, setOpenDraftsDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setPosts(getPosts());
    setDrafts(getDrafts());
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

  const handleDeleteDraft = (id, event) => {
    event.stopPropagation();
    deleteDraft(id);
    setDrafts(getDrafts());
    setSnackbar({
      open: true,
      message: '임시저장된 글이 삭제되었습니다.',
      severity: 'success'
    });
  };

  const handleContinueWriting = (draft) => {
    if (draft.originalPostId) {
      // 수정 중이던 글
      navigate(`/edit/${draft.originalPostId}`);
    } else {
      // 새로 작성 중이던 글
      navigate('/write');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          {drafts.length > 0 && (
            <Tooltip title="임시저장된 글이 있습니다">
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<SaveIcon />}
                onClick={() => setOpenDraftsDialog(true)}
              >
                <Badge badgeContent={drafts.length} color="error">
                  임시저장 목록
                </Badge>
              </Button>
            </Tooltip>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/write')}
            fullWidth={isMobile}
          >
            새 글 작성
          </Button>
        </Box>
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

      {/* 임시저장 목록 다이얼로그 */}
      <Dialog
        open={openDraftsDialog}
        onClose={() => setOpenDraftsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>임시저장 목록</DialogTitle>
        <DialogContent dividers>
          {drafts.length > 0 ? (
            <List>
              {drafts.map((draft) => (
                <ListItem 
                  key={draft.id} 
                  button 
                  onClick={() => handleContinueWriting(draft)}
                  sx={{ 
                    border: '1px solid #eee', 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { bgcolor: '#f5f5f5' } 
                  }}
                >
                  <ListItemText
                    primary={draft.title || '(제목 없음)'}
                    secondary={`마지막 저장: ${formatDate(draft.lastSaved)} ${draft.originalPostId ? '(수정 중)' : '(새 글)'}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={(e) => handleDeleteDraft(draft.id, e)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography align="center" sx={{ py: 3 }}>
              임시저장된 글이 없습니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDraftsDialog(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 알림 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 