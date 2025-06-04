const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('index', { posts });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', async (req, res) => {
  const { title, article, author } = req.body;
  try {
    const newPost = new Post({ title, article, author });
    await newPost.save();
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.render('new', { error: 'Cannot save posts. Check data' });
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect('/posts');
    res.render('edit', { post });
  } catch (err) {
    console.error(err);
    res.redirect('/posts');
  }
});

router.put('/:id', async (req, res) => {
  const { title, article, author } = req.body;
  try {
    await Post.findByIdAndUpdate(req.params.id, { title, article, author });
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.redirect(`/posts/${req.params.id}/edit`);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.redirect('/posts');
  }
});

router.get('/:id/json', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="post-${post._id}.json"`
    );
    res.setHeader('Content-Type', 'application/json');

    return res.send(JSON.stringify(post, null, 2));
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
