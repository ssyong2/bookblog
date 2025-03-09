import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Container,
  ImageList,
  ImageListItem,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';
import { getPost, updatePost, saveDraftWithId, getDrafts, getDraftById, deleteDraft } from '../utils/storage';

export default function BlogEdit() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnailImage: '',
    images: [],
  });
  const [originalPost, setOriginalPost] = useState(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDraftsDialog, setOpenDraftsDialog] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const post = getPost(id);
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        thumbnailImage: post.thumbnailImage || '',
        images: post.images || [],
      });
      setOriginalPost(post);
      
      // 해당 게시글의 임시저장 확인
      const draft = getDraftById(id);
      if (draft) {
        setSnackbar({
          open: true,
          message: '이 글의 임시저장본이 있습니다. 임시저장 목록에서 확인하세요.',
          severity: 'info'
        });
      }
    } else {
      setError('게시글을 찾을 수 없습니다.');
    }
    
    // 임시저장 목록 불러오기
    setDrafts(getDrafts().filter(draft => draft.originalPostId === id));
  }, [id]);

  // 자동 저장 (30초마다)
  useEffect(() => {
    if (!originalPost) return;
    
    const autoSaveInterval = setInterval(() => {
      if (formData.title.trim() || formData.content.trim()) {
        handleAutoSave();
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData, originalPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAutoSave = () => {
    if (formData.title.trim() || formData.content.trim()) {
      saveDraftWithId(`edit_${id}_${Date.now()}`, {
        ...formData,
        originalPostId: id
      });
    }
  };

  const handleManualSave = () => {
    if (formData.title.trim() || formData.content.trim()) {
      saveDraftWithId(`edit_${id}_${Date.now()}`, {
        ...formData,
        originalPostId: id
      });
      
      setSnackbar({
        open: true,
        message: '임시저장 되었습니다.',
        severity: 'success'
      });
      
      // 임시저장 목록 업데이트
      setDrafts(getDrafts().filter(draft => draft.originalPostId === id));
    } else {
      setSnackbar({
        open: true,
        message: '제목이나 내용을 입력해주세요.',
        severity: 'warning'
      });
    }
  };

  const handleImageUpload = useCallback((e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const handleDeleteImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      thumbnailImage: prev.thumbnailImage === prev.images[index] ? '' : prev.thumbnailImage,
    }));
  };

  const handleThumbnailChange = (image) => {
    setFormData(prev => ({
      ...prev,
      thumbnailImage: image,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setSnackbar({
        open: true,
        message: '제목과 내용을 모두 입력해주세요.',
        severity: 'error'
      });
      return;
    }

    const updated = updatePost(id, formData);
    if (updated) {
      // 해당 게시글의 모든 임시저장 삭제
      const relatedDrafts = getDrafts().filter(draft => draft.originalPostId === id);
      relatedDrafts.forEach(draft => deleteDraft(draft.id));
      
      navigate('/');
    } else {
      setError('수정 중 오류가 발생했습니다.');
    }
  };

  const handleLoadDraft = (draft) => {
    setFormData(draft);
    setOpenDraftsDialog(false);
    setSnackbar({
      open: true,
      message: '임시저장된 글을 불러왔습니다.',
      severity: 'success'
    });
  };

  const handleDeleteDraft = (id, event) => {
    event.stopPropagation();
    deleteDraft(id);
    setDrafts(getDrafts().filter(draft => draft.originalPostId === originalPost.id));
    setSnackbar({
      open: true,
      message: '임시저장된 글이 삭제되었습니다.',
      severity: 'success'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 0, mt: '32px', px: { xs: '16px', md: 0 } }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            목록으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 0, mt: '32px', px: { xs: '16px', md: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            글 수정하기
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<SaveIcon />}
              onClick={handleManualSave}
            >
              임시저장
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => setOpenDraftsDialog(true)}
              disabled={drafts.length === 0}
            >
              임시저장 목록 ({drafts.length})
            </Button>
          </Box>
        </Box>
        <Paper sx={{ p: 3 }} elevation={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="제목"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="내용"
              name="content"
              value={formData.content}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={15}
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
              >
                이미지 추가
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>

            {formData.images.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  업로드된 이미지
                </Typography>
                <RadioGroup
                  value={formData.thumbnailImage}
                  onChange={(e) => handleThumbnailChange(e.target.value)}
                >
                  <ImageList sx={{ width: '100%' }} cols={3} rowHeight={200}>
                    {formData.images.map((image, index) => (
                      <ImageListItem key={index} sx={{ position: 'relative' }}>
                        <img
                          src={image}
                          alt={`업로드된 이미지 ${index + 1}`}
                          loading="lazy"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <FormControlLabel
                            value={image}
                            control={<Radio size="small" />}
                            label="대표 이미지"
                            sx={{ m: 0 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </RadioGroup>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                수정하기
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => {
                  if (window.confirm('수정 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
                    navigate('/');
                  }
                }}
              >
                취소
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

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
                  onClick={() => handleLoadDraft(draft)}
                  sx={{ 
                    border: '1px solid #eee', 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { bgcolor: '#f5f5f5' } 
                  }}
                >
                  <ListItemText
                    primary={draft.title || '(제목 없음)'}
                    secondary={`마지막 저장: ${formatDate(draft.lastSaved)}`}
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
    </Container>
  );
} 