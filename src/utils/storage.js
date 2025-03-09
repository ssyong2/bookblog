const STORAGE_KEY = 'blog_posts';
const DRAFT_KEY = 'blog_draft';

export const getPosts = () => {
  const posts = localStorage.getItem(STORAGE_KEY);
  return posts ? JSON.parse(posts) : [];
};

export const getPost = (id) => {
  const posts = getPosts();
  return posts.find(post => post.id === id) || null;
};

export const savePost = (postData) => {
  const posts = getPosts();
  const newPost = {
    ...postData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newPost, ...posts]));
  return newPost;
};

export const updatePost = (id, postData) => {
  const posts = getPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) return null;
  
  const updatedPost = {
    ...posts[postIndex],
    ...postData,
    updatedAt: new Date().toISOString(),
  };
  
  posts[postIndex] = updatedPost;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return updatedPost;
};

export const deletePost = (id) => {
  const posts = getPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPosts));
  return true;
};

export const saveDraft = (draft) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const getDraft = () => {
  const draft = localStorage.getItem(DRAFT_KEY);
  return draft ? JSON.parse(draft) : null;
};

export const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
}; 