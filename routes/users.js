const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//get all the users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    const usersWithPublicData = users.map(user=>{ 
      const { adminStatus, password, updatedAt, ...remainingData } = user._doc;
      return remainingData
    })
    res.status(200).json(usersWithPublicData);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get a particular user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { adminStatus, password, updatedAt, ...remainingData } = user._doc;
    res.status(200).json(remainingData);
  } catch (err) {
    res.status(500).json(err);
  }
});


//update user
router.put("/:userId", async (req, res) => {
  try {
    if (req.body.userId === req.params.userId || req.body.isAdmin) {
      await User.findByIdAndUpdate(req.body.userId, { $set: req.body});
      res.status(200).json("Account has been updated");
    } else {
      return res.status(403).json("You can update only your account!");
    }
  } catch (err) {
      return res.status(500).json(err);
  }
});


//delete user
router.delete("/:userId", async (req, res) => {
  try {
    if (req.body.userId === req.params.userId || req.body.isAdmin) {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("Account has been deleted");
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  }
  catch (err) {
    return res.status(500).json(err);
  }
});



// follow/Unfollow a user
router.put("/:userId/follow", async (req, res) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const currentUser = await User.findById(req.params.userId);
      const otherUser = await User.findById(req.body.userId);

      if (!otherUser.followers.includes(req.params.userId)) {
        await otherUser.updateOne({ $push: { followers:  req.params.userId} });
        await currentUser.updateOne({ $push: { followings: req.body.userId} });
        res.status(200).json("You started following a new person");
      } else {
        await otherUser.updateOne({ $pull: { followers: req.params.userId } });
        await currentUser.updateOne({ $pull: { followings: req.body.userId } });
        res.status(200).json("You unfollowed this person");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user
// router.put("/:userId/unfollow", async (req, res) => {
//     if (req.body.userId !== req.params.userId) {
//       try {
//         const currentUser = await User.findById(req.params.userId);
//         const otherUser = await User.findById(req.body.userId);
//         if (otherUser.followers.includes(req.params.userId)) {
//           await otherUser.updateOne({ $pull: { followers: req.params.userId } });
//           await currentUser.updateOne({ $pull: { followings: req.body.userId } });
//           res.status(200).json("You unfollowed the person");
//         } else {
//           res.status(403).json("You dont follow this user");
//         }
//       } catch (err) {
//         res.status(500).json(err);
//       }
//     } else {
//       res.status(403).json("You cant unfollow yourself");
//     }
//   });

module.exports = router;
