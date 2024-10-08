
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_SECRET_KEY;

const getPosts = async (req, res) => {
    // res.send('this is working');
    const query = req.query;
    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || undefined,
                    lte: parseInt(query.maxPrice) || undefined,
                },
            },
        });
        //    setTimeout(() => {
        res.status(200).json(posts);
        //    }, 1500);
    } catch (error) {
        console.log();
        res.status(500).json({ message: error });
    }
}
const getPost = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    // try {
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            postDetail: true,
            user: {
                select: {
                    username: true,
                    avatar: true
                }

            }
        }
    });

    let userId;
    const token = req.cookies?.token;
    if (!token) {
        userId = null;
    } else {
        jwt.verify(token, jwtKey, async (err, payload) => {
            if (err) {
                userId = null;
            } else {
                userId = payload.id;
            }
        });
    }
    const saved = await prisma.savedPost.findUnique({
        where: {
            userId_postId: {
                postId: id,
                userId
            }
        }
    })

    res.status(200).json({ ...post, isSaved: saved ? true : false });


    // } catch (error) {
    //     console.log();
    //     res.status(500).json({ message: "Failed to get post" });

    // }
}
const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;


    // try {
    const newPost = await prisma.post.create({
        data: {
            ...body.postData,
            userId: tokenUserId,
            postDetail: {
                create: body.postDetail
            }
        }
    })
    res.status(200).json(newPost);

    // } catch (error) {
    //     console.log();
    //     res.status(500).json({ message: "Failed to add  post" });

    // }
}
const updatePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId) return res.status(403).json({ message: "Not authorized" });

    try {
        await prisma.post.delete({
            where: { id }
        })

        res.status(200).json({ message: "post deleted" });


    } catch (error) {
        console.log();
        res.status(500).json({ message: "Failed to update post" });

    }
}

const deletePost = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    try {

        const findPost = await prisma.post.findUnique({
            where: { id }
        });

        if (findPost.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await prisma.post.delete({
            where: { id }
        })
        res.status(200).json({ message: "post deleted" });

    } catch (error) {
        console.log();
        res.status(500).json({ message: "Failed to delete post" });

    }
}


export { getPosts, getPost, addPost, updatePost, deletePost }