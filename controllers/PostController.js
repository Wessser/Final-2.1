import PostModel from "../models/Post.js";
import mongoose from "mongoose";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();//=================Получаем все теги
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);//=================Получаем
        res.json(tags);//=================Отправляем теги
    }catch (err) {
        console.log(err);
        res.status(500).json({//===============================================================Отправляем сообщение об ошибке
            message:'Не удалось найти теги',
        });
    }
};
export const getAll = async (req, res) => {
try {
    const posts = await PostModel.find().populate('user').exec();//=================Получаем все посты 
    
    res.json(posts);
    }catch (err){
        res.status(500).json({
            message:'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;//=================Получаем пост по ID

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                message: 'Некорректный ID',
            });
        }

        const doc = await PostModel.findOneAndUpdate(
        {
            _id:postId,
        },
        {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after',
        },
    );
        if (!doc) {
            return res.status(404).json({
                message:'Статья не найдена',
            });
        }
        res.json(doc);
    }catch (err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось получить статьи',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;//=================Получаем пост по ID
        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                message: 'Некорректный ID',
            });
        }
    // Удаляем статью с помощью findOneAndDelete и используем await для асинхронности
    const doc = await PostModel.findOneAndDelete({
        _id: postId,
        });

      if (!doc) { // Если документ не найден
        return res.status(404).json({
            message: 'Статья не найдена',
        });
    }

      // Если удаление успешно, возвращаем успешный ответ
    res.json({
        success: true,
        message: 'Статья удалена',
    });
    } catch (err) { // Обработка ошибок
        console.log(err); // Логируем ошибку
        res.status(500).json({
        message: 'Не удалось удалить статью', // Сообщение об ошибке
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({//===============================================================Отправляем сообщение об ошибке
            message:'Не удалось создать пост',
        });
    }
};

export const update = async (req, res) => {
    try{
        const postId = req.params.id;//=================Получаем пост по ID

        await PostModel.updateOne({
            _id: postId,
        },{
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        },);
        res.json({
            success: true,
            message: 'Статья обновлена',
        });
    }catch (err){
        console.log(err);
        res.status(500).json({//===============================================================Отправляем сообщение об ошибке
            message:'Не удалось обновить пост',
        });
    }
};