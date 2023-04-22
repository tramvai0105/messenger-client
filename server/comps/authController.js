const User = require("../models/User")
const bcrypt = require('bcryptjs');
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const {secret} = require("../config");
const Friends = require("../models/Friends");

function generateAccessToken(id){
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController{
    async registration(req, res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message:"Ошибка при регистрации", errors})
        }
        const {username, password} = req.body;
        const candidate = await User.findOne({username})
        if(candidate){
            return res.status(400).json({message: "Пользователь с таким именем уже существует"})
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const user = new User({username, password:hashPassword})
        const friends = new Friends({userId: user._id})
        await user.save();
        await friends.save();
        return res.json({message: "Пользователь успешно зарегистрирован"})
    }

    async login(req, res){
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message:`Пользователь ${username} не найден`});
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({message:`Неправильный пароль`});
        }
        const token = generateAccessToken(user._id);
        return res.json({token})
    }

    async getUsers(req, res){
        const users = await User.find();
        res.json(users)
    }
}

module.exports = new authController();