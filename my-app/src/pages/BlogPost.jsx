import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '../utils/storage';

export default function BlogPost({ post, open, onClose, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      deletePost(post.id);
      onDelete();
      onClose();
    }
  };

  if (!post) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 0,
          position: 'relative',
          mx: { xs: '0', md: '0' },
          width: { xs: '100%', md: '100%' },
          maxWidth: 'lg',
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle sx={{ pr: 6, px: { xs: '16px', md: '16px' } }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          작성일: {new Date(post.createdAt).toLocaleDateString()}
          {post.updatedAt !== post.createdAt &&
            ` (수정됨: ${new Date(post.updatedAt).toLocaleDateString()})`}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ 
        px: { xs: '16px', md: '16px' },
        overflowY: 'auto',
        flex: 1
      }}>
        {post.thumbnailImage && (
          <Box sx={{ mb: 3 }}>
            <img
              src={post.thumbnailImage}
              alt="대표 이미지"
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </Box>
        )}

        <Typography
          variant="body1"
          component="div"
          sx={{ 
            whiteSpace: 'pre-wrap',
            mb: 3,
            '& p': { marginBottom: 2 }
          }}
        >
          {post.content}
        </Typography>

        {post.images && post.images.length > 1 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              첨부된 이미지
            </Typography>
            <ImageList sx={{ width: '100%' }} cols={3} rowHeight={200}>
              {post.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`첨부 이미지 ${index + 1}`}
                    loading="lazy"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, px: { xs: '16px', md: '16px' }, justifyContent: 'flex-end' }}>
        <Button
          startIcon={<EditIcon />}
          onClick={() => {
            onClose();
            navigate(`/edit/${post.id}`);
          }}
        >
          수정하기
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={handleDelete}
        >
          삭제하기
        </Button>
      </DialogActions>
    </Dialog>
  );
} 