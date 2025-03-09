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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { getPost, updatePost } from '../utils/storage';

export default function BlogEdit() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnailImage: '',
    images: [],
  });
  const [error, setError] = useState('');
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
    } else {
      setError('게시글을 찾을 수 없습니다.');
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const updated = updatePost(id, formData);
    if (updated) {
      navigate('/');
    } else {
      setError('수정 중 오류가 발생했습니다.');
    }
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
        <Typography variant="h4" component="h1" gutterBottom>
          글 수정하기
        </Typography>
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
    </Container>
  );
} 