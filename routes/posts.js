const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//get all the posts
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    const users = await User.find();

    const postList = posts.map((post) => {
      const { comments, __v, ...postData } = post._doc;
      let author = users.filter((user) => user._id == postData.author.id);
      postData.profilePicture = author[0]?.profilePicture.toString("base64");
      return postData;
    });

    res.status(200).json(postList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ "author.id": currentUser._id });
    const friendPosts = await Promise.all(
      currentUser?.followings?.map((friendId) => {
        return Post.find({ "author.id": friendId });
      })
    );

    const allPosts = userPosts.concat(...friendPosts);

    const users = await User.find();

    const postList = allPosts.map((post) => {
      const { comments, __v, ...postData } = post._doc;
      let author = users.filter((user) => user._id == postData.author.id);
      postData.profilePicture = author[0]?.profilePicture.toString("base64");
      return postData;
    });
    res.status(200).json(postList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get list of posts
router.get("/list/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ "author.id": req.params.userId });
    const users = await User.find();

    const responseData = posts.map((post) => {
      const { comments, __v, ...postData } = post._doc;
      let author = users.filter((user) => user._id == postData.author.id);
      postData.profilePicture = author[0]?.profilePicture.toString("base64");
      return postData;
    });
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a specific post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const users = await User.find();

    const { comments, __v, ...postData } = post._doc;
    let author = users.filter((user) => user._id == postData.author.id);
    postData.profilePicture = author[0]?.profilePicture.toString("base64");

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get comments for a specific post
router.get("/:postId/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a post
router.post("/new", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    const author = await User.findById(req.body.author.id);

    const { profilePicture } = author._doc;
    const { comments, __v, ...postData } = savedPost._doc;
    
    postData.profilePicture = profilePicture.toString("base64");
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.author.id === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.author.id === req.body.userId) {
      await Post.deleteOne({ _id: post._id });
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a post
router.put("/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//comment on a specific post
router.put("/:postId/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    await post.updateOne({ $push: { comments: req.body } });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a specific commnet
router.delete("/:postId/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    await post.updateOne({ $pull: { comments: { _id: req.body.commentId } } });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a comment
router.put("/:postId/comment/like", async (req, res) => {
  try {
    let liked = false;
    const { userId, postId, commentId } = req.body;
    const post = await Post.findById(req.params.postId);
    post?.comments?.map((comment) => {
      if (String(comment?._id) === commentId) {
        if (Object.values(comment?.likes).includes(userId)) {
          liked = true;
        }
      }
    });
    if (!liked) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { "comments.$[comment].likes": userId } },
        { arrayFilters: [{ "comment._id": commentId }] }
      );
      res.status(200).json("The comment has benn liked");
    } else {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { "comments.$[comment].likes": userId } },
        { arrayFilters: [{ "comment._id": commentId }] }
      );
      res.status(200).json("The comment has benn disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
