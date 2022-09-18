import express from "express";
import cors from "cors"; 
import router from "../routes";
import deserializeUser from "../middlewares/deserializeUser";

function createServer()  {
    const app = express();

    app.use(express.json());
    app.use(cors({
        origin: ['http://127.0.0.1:5173'],
        credentials: true 
    }));
    app.use(deserializeUser); 

    app.use(router);

    return app; 
}

export default createServer;