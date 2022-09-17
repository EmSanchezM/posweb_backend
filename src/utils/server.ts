import express from "express";
import cors from "cors"; 
import router from "../routes";
import deserializeUser from "../middlewares/deserializeUser";

function createServer()  {
    const app = express();

    app.use(cors({
        origin: '*',
        credentials: true 
    }));
    app.use(express.json());
    app.use(deserializeUser); 

    app.use(router);

    return app; 
}

export default createServer;