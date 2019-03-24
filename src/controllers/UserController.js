const sharp = require('sharp');
const User = require("../models/user");
const { sendWelcomeEmail, sendDeleteEmail } = require('../emails/account');


const createUser = async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
};

const logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send();
    }
};
const logoutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send();
    }
};

const readProfile = (req, res) => {
    res.send(req.user);
}

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status.send({ error: "Invalid updates!" });
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user);
    } catch (e) {
        res.status(400).send();
    }
}

const deleteUser = async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        await req.user.remove();
        sendDeleteEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
}




const uploadAvatar = async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}
const uploadError = (error, req, res, next) => {
    res.status(400).send({ error: error.message });
}

const deleteAvatar = async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
};

const getAvatar = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
};

module.exports = {
    createUser,
    loginUser,
    logoutAll,
    logoutUser,
    readProfile,
    updateUser,
    deleteUser,
    uploadAvatar,
    uploadError,
    deleteAvatar,
    getAvatar
}