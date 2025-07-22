import { Request, Response } from "express";
import Follow from "../models/Follow";

export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.user._id.toString();
    const followingId = req.params.userId;

    console.log("followerId:", followerId);
    console.log("followingId:", followingId);

    if (followerId === followingId) {
      console.log("❌ Intento de seguirse a sí mismo");
      return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      console.log("❌ Ya está siguiendo al usuario");
      return res.status(400).json({ error: "Ya sigues a este usuario" });
    }

    const follow = new Follow({ follower: followerId, following: followingId });
    await follow.save();

    console.log("✅ Follow guardado");
    res.status(201).json({ message: "Ahora sigues a este usuario" });
  } catch (error: any) {
    console.error("❌ Error al seguir:", error);
    res.status(500).json({ error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id.toString();

    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: userId,
    });

    if (!follow) {
      return res.status(404).json({ error: "No sigues a este usuario" });
    }

    res.json({ message: "Dejaste de seguir al usuario exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "handle name image description")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Follow.countDocuments({ following: userId });

    res.json({
      followers: followers.map((f) => f.follower),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const following = await Follow.find({ follower: userId })
      .populate("following", "handle name image description")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Follow.countDocuments({ follower: userId });

    res.json({
      following: following.map((f) => f.following),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id.toString();

    const isFollowing = await Follow.exists({
      follower: followerId,
      following: userId,
    });

    res.json({ isFollowing: !!isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function getMyFollowers(req: Request, res: Response) {
  try {
    const myId = (req.user as any)._id.toString();

    const followers = await Follow.find({ following: myId }).populate(
      "follower",
      "name handle image"
    );

    const followerUsers = followers.map((f) => f.follower);

    res.json(followerUsers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus seguidores" });
  }
}
