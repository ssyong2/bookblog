import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
  Alert,
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
import { savePost, saveDraft, getDraft, clearDraft, saveDraftWithId, getDrafts, getDraftById, deleteDraft } from '../utils/storage';

export default function BlogWrite() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnailImage: '',
    images: [],
  });
  const [draftId, setDraftId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDraftsDialog, setOpenDraftsDialog] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setFormData(draft);
      setSnackbar({
        open: true,
        message: '이전에 작성 중이던 글을 불러왔습니다.',
        severity: 'info'
      });
    }
    
    setDrafts(getDrafts());
  }, []);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (formData.title.trim() || formData.content.trim()) {
        handleAutoSave();
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData, draftId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    saveDraft(newFormData);
  };

  const handleAutoSave = () => {
    if (formData.title.trim() || formData.content.trim()) {
      const savedDraft = saveDraftWithId(draftId, formData);
      setDraftId(savedDraft.id);
    }
  };

  const handleManualSave = () => {
    if (formData.title.trim() || formData.content.trim()) {
      const savedDraft = saveDraftWithId(draftId, formData);
      setDraftId(savedDraft.id);
      setSnackbar({
        open: true,
        message: '임시저장 되었습니다.',
        severity: 'success'
      });
      
      setDrafts(getDrafts());
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

    savePost(formData);
    clearDraft();
    if (draftId) {
      deleteDraft(draftId);
    }
    navigate('/');
  };

  const handleLoadDraft = (draft) => {
    setFormData(draft);
    setDraftId(draft.id);
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
    setDrafts(getDrafts());
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 0, mt: '32px', px: { xs: '16px', md: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            새 글 작성
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
            >
              임시저장 목록
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
                저장하기
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => {
                  if (window.confirm('작성 중인 내용이 저장되지 않을 수 있습니다. 정말 취소하시겠습니까?')) {
                    clearDraft();
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