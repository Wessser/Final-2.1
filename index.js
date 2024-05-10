import express from 'express';//=============================Подключение express
import mongoose from 'mongoose';//===============================Подключение mongoose
import {registerValidation, postCreateValidation, loginValidation} from './validations.js';//===============================Подключение валидации регистрации
import multer from 'multer';
import cors from 'cors';//=========================================================================== Подключение cors

import {chechAuth, handleValidationErrors} from './utils/index.js';
import {UserController, PostController} from './controllers/index.js';

mongoose
    .connect(
        process.env.MONGO_URI
    )//==================Подключение к базе данных
    .then(() => console.log('DB ok'))//==============================================Если подключение к базе данных прошло успешно
    .catch((err) => console.log('DB error', err));//==============================================Если подключение к базе данных не прошло

// ==========================================================================Создаем express приложение

const app = express();

const storage = multer.diskStorage({ //===============================================Создаем хендлер для загрузки файла
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());//===============================================Подключение json
app.use(cors());//===============================================Подключение cors
app.use('/uploads', express.static('uploads'));

app.post('/auth/login',loginValidation,handleValidationErrors, UserController.login, );// ===============================================================================Запрос на авторизацию
app.post('/auth/register', registerValidation,handleValidationErrors, UserController.register, );//===============================================================================Запрос на регистрацию
app.get('/auth/me', chechAuth, UserController.getMe, );//==============================================================================Запрос на получение данных пользователя

app.post('/upload', chechAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.get('/tags', PostController.getLastTags);//=============================================Запрос на получение последних
app.get('/posts', PostController.getAll);//=============================================Запрос на получение всех постов
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',chechAuth, postCreateValidation,handleValidationErrors, PostController.create);
app.delete('/posts/:id', chechAuth, PostController.remove, );
app.patch('/posts/:id', chechAuth,postCreateValidation,handleValidationErrors, PostController.update, );

app.listen(process.env.PORT|| 4444, (err) =>{
    if (err){
        return console.log(err);
    }

    console.log('Server OK');//===============================================================Если сервер запущен, то выводим сообщение
});