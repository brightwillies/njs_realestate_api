import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js';


export const getUsers = async (req, res) => {

  try {
    const users = await prisma.user.findMany();

    const sanitizedUsers = users.map(({ password, ...rest }) => rest);

    console.log(sanitizedUsers);
    res.status(200).json(sanitizedUsers);


  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "failed  to login" })

  }
}
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    res.status(200).json(user);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "failed  to login" })

  }
}

export const updateUser = async (req, res) => {

  const id = req.params.id;
  const tokenUserId = req.userId;
  // const body = req.body;
  const { password, avatar, ...inputs } = req.body;
  if (id !== tokenUserId) return res.status(403).json({ message: "Not authorized" });
  let updatedPassword = null;
  // try {
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updatedPassword = await bcrypt.hash(password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...inputs,
      ...(updatedPassword && { password: updatedPassword }),
      ...(avatar && { avatar })
    }
  });

  const { password: userPassword, ...sanitizedUser } = updatedUser;

  res.status(200).json(sanitizedUser);

  // } catch (error) {

  //     console.log(error);
  //     res.status(500).json({ message: "failed  to login" })

  // }
}

export const deleteUser = async (req, res) => {


  const id = req.params.id;
  const tokenUserId = req.userId;
  if (id !== tokenUserId) return res.status(403).json({ message: "Not authorized" });
  try {
    await prisma.user.delete({
      where: { id }
    })

    res.status(200).json({ message: "user deleted" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "failed  to login" })

  }
}

const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  //  try {
  const savedPost = await prisma.savedPost.findUnique({
    where: {
      userId_postId: {
        userId: tokenUserId,
        postId,
      },
    },
  });

  if (savedPost) {
    await prisma.savedPost.delete({
      where: {
        id: savedPost.id,
      },
    });
    res.status(200).json({ message: "Post removed from saved list" });
  } else {
    await prisma.savedPost.create({
      data: {
        userId: tokenUserId,
        postId,
      },
    });
    res.status(200).json({ message: "Post saved" });
  }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: "Failed to delete users!" });
  // }
};
const profilePosts = async (req, res) => {
  const tokenUserId = req.params.userId;
  const id = req.params.id;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId }
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true
      }
    });
    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });


  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "failed  to get profile  posts" })

  }
}
const getNotification = async (req, res) => {
  const tokenUserId = req.userId;
  
  try {
    const number = await prisma.chat.count({
      where: {
         userIDs: {
           hasSome: [tokenUserId ]
          }, 
          NOT : {
            seenBy : {
              hasSome : [tokenUserId]
            }
          }
         }
    });
   console.log(number);
    res.status(200).json(number);


  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "failed  to get profile  posts" })

  }
}

export { savePost, profilePosts, getNotification }

