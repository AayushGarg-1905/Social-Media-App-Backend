import dotenv from 'dotenv'
import express from "express";
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './db/connect';
import fileUpload from 'express-fileupload';
import errorHandlerMiddleware from "./middlewares/error_handler.middleware";
import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import postRouter from './routes/post.routes'
import CommentRouter from './routes/comment.routes'
import path from 'path';
import cors from 'cors'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json())
app.use(fileUpload());
app.use(helmet())
app.use(morgan('tiny'))

app.get('/health',(req,res)=>{
    res.send('OK');
})
app.use('/api/v1/auth/users', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/comments',CommentRouter);
app.use(errorHandlerMiddleware);

const port = 9000;
const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URL || '');
        app.listen(9000,()=>{
            console.log(`Server is listening on port ${port}...`)
        })
    }catch(error){
        console.log('Connection error ',error);
    }
}

start()