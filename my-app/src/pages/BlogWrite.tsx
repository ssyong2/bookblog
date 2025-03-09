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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { BlogFormData } from '../types/blog';
import { savePost, saveDraft, getDraft, clearDraft } from '../utils/storage';

export default function BlogWrite() {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    thumbnailImage: '',
    images: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setFormData(draft);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    saveDraft(newFormData);
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const handleDeleteImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      thumbnailImage: prev.thumbnailImage === prev.images[index] ? '' : prev.thumbnailImage,
    }));
  };

  const handleThumbnailChange = (image: string) => {
    setFormData(prev => ({
      ...prev,
      thumbnailImage: image,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    savePost(formData);
    clearDraft();
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          새 글 작성
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="제목"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
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
            />
            
            <Box sx={{ mt: 3 }}>
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
              <Box sx={{ mt: 2 }}>
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
                          }}
                        >
                          <FormControlLabel
                            value={image}
                            control={<Radio />}
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

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
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
                onClick={() => navigate('/')}
              >
                취소
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 