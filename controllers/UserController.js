import jwt from 'jsonwebtoken';//===============================Подключение jsonwebtoken
import bcrypt from 'bcrypt';//===============================Подключение bcrypt

import UserModel from '../models/User.js'//===============================Подключение модели пользователя

export const register = async (req,res) => {
    //==============================================================================Проверка на ошибки
    try {
        //===============================================================================Шифрование пароля
    
        const password = req.body.password;//===============================================================Получаем пароль из тела запроса
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({//===============================================================Создаем модель пользователя
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash:hash,
        });
    
        const user = await doc.save();//===============================================================Сохраняем модель пользователя в базу данных

        const token = jwt.sign({//===============================================================Создаем токен ID пользователя
            _id: user._id,
        },
        'secretKey',//===============================================================Секретный ключ
        {
            expiresIn: 3600, //===============================================================Время жизни токена
        },
    );
    
    const {passwordHash, ...userData} = user._doc;//===============================================================Убираем пароль из ответа

        res.json({
            ...userData, 
            token,
        });//===============================================================Отправляем пользователя и токен
    } catch (err) { //======================================================================Если ошибка, то выводим её
            console.log(err);
        res.status(500).json({//===============================================================Отправляем сообщение об ошибке
            message:'Не удалось зарегистрироваться',
        });
    }
};

export const login = async (req,res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });//===========================Получаем пользователя из базы данных

        if (!user) {
            return res.status(404).json({ message: 'Неверный логин или пароль' });//=======================Если пользователь не найден, то возвращаем ошибку
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);//===================Проверка пароля

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Неверный логин или пароль' });//=======================Если пароль не совпадает, то возвращаем ошибку
        }

        const token = jwt.sign({//===============================================================Создаем токен ID пользователя
            _id: user._id,
        },
        'secretKey',//===============================================================Секретный ключ
        {
            expiresIn: 3600, //===============================================================Время жизни токена
        },
    );

    const {passwordHash, ...userData} = user._doc;//===============================================================Убираем пароль из ответа

    res.json({
        ...userData, 
        token,
    });//===============================================================Отправляем пользователя и токен

        } catch (err) {
            res.status(500).json({ message: 'Не удалось авторизоваться' });
        }
};

export const getMe = async (req,res) => {
    try{
        const user = await UserModel.findById(req.userId);//===============================================================Получаем пользователя по ID

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });//=======================Если пользователь не найден, то возвращаем ошибку
        }

        const {passwordHash, ...userData} = user._doc;//===============================================================Убираем пароль из ответа

        res.json({userData,});//===============================================================Отправляем пользователя
    } catch (err) {
        console.log(err);
        res.status(500).json({//===============================================================Отправляем сообщение об ошибке
            message:'Нет доступа',
        });
    }
};