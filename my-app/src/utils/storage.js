const STORAGE_KEY = 'blog_posts';
const DRAFT_KEY = 'blog_draft';
const DRAFTS_KEY = 'blog_drafts';

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

export const saveDraftWithId = (id, draft) => {
  const drafts = getDrafts();
  const newDraft = {
    ...draft,
    id: id || Date.now().toString(),
    lastSaved: new Date().toISOString(),
  };
  
  const existingIndex = drafts.findIndex(d => d.id === newDraft.id);
  if (existingIndex !== -1) {
    drafts[existingIndex] = newDraft;
  } else {
    drafts.push(newDraft);
  }
  
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return newDraft;
};

export const getDrafts = () => {
  const drafts = localStorage.getItem(DRAFTS_KEY);
  return drafts ? JSON.parse(drafts) : [];
};

export const getDraftById = (id) => {
  const drafts = getDrafts();
  return drafts.find(draft => draft.id === id) || null;
};

export const deleteDraft = (id) => {
  const drafts = getDrafts();
  const filteredDrafts = drafts.filter(draft => draft.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(filteredDrafts));
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