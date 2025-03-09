import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '../utils/storage';

export default function BlogPost({ post, open, onClose, onDelete }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!post) return null;

  const handleEdit = () => {
    onClose();
    navigate(`/edit/${post.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      deletePost(post.id);
      onDelete();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      scroll="paper"
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          p: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ py: isMobile ? 2 : 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ pr: 4 }}>
              <Typography variant="h5" component="div" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                작성일: {new Date(post.createdAt).toLocaleDateString()}
                {post.updatedAt !== post.createdAt && 
                  ` (수정됨: ${new Date(post.updatedAt).toLocaleDateString()})`}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: { xs: 16, md: 'calc((100% - 900px) / 2 + 16px)' },
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Container>
      </DialogTitle>

      <DialogContent 
        sx={{ 
          p: 0,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          },
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              mb: 3,
              fontSize: isMobile ? '1rem' : '1.1rem',
              lineHeight: 1.7,
            }}
          >
            {post.content}
          </Typography>

          {post.images && post.images.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                첨부된 이미지
              </Typography>
              <ImageList 
                sx={{ 
                  width: '100%',
                  mb: 0,
                }} 
                cols={isMobile ? 1 : 2} 
                gap={16}
              >
                {post.images.map((image, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{
                      overflow: 'hidden',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <img
                      src={image}
                      alt={`이미지 ${index + 1}`}
                      loading="lazy"
                      style={{ 
                        width: '100%',
                        height: isMobile ? '300px' : '400px',
                        objectFit: 'cover',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}
        </Container>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            py: isMobile ? 2 : 3,
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            startIcon={<EditIcon />}
            onClick={handleEdit}
            color="primary"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
          >
            수정
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            color="error"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
          >
            삭제
          </Button>
        </Container>
      </DialogActions>
    </Dialog>
  );
} 