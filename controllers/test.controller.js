


export const shouldBeLoggedIn = async (req, res) => {

    console.log(req.userId);
    res.status(200).json({ message: "You are authenticated" });
}
export const shouldBeAdmin = async (req, res) => {

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not Authenticated" });
    jwt.verify(token, SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        if (payload.isAdmin) {
            res.status(200).json({ message: "You are an admin" });
        } else {
            res.status(200).json({ message: "You are not and admin" });
        }

    });

    // if(payload.isAdmin) {
    //       res.status(200).json({ message: "You are and admin" });
    // } else{
    // res.status(200).json({ message: "You are authenticated" });
    // }
}

