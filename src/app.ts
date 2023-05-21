import {routes} from "./routes/Routes";
import {Request , Response, NextFunction} from 'express'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import logger from 'morgan'
//import session from "express-session";

const App = express();

App.use(bodyParser.urlencoded({extended : true}));
App.use(express.json());

//App.use(corsMiddleware);
App.use((request: Request, response: Response
    , next:NextFunction) =>{
    response.header("Access-Control-Allow-Origin", "*"); 
    //Update to match the domain you will make the request 
    //From ex: http://localhost:3000 do cliente react
    response.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,UPDATE,PATCH,OPTIONS")
    response.header("Access-Control-Allow-Headers","Origin, X-Requested-With,Content-Disposition, Content-Type, Accept, Authorization");
    App.use(cors)
    next();
});

//Rota para visualizar os ficheiros da pasta uploads (navegador)
// localhost:porta/kitadi/files/nome_arquivo
App.use("/api/files", express.static("uploads"));

// para imprimir os logs da API
App.use(logger('dev'))
// add as Rotas da API
App.use(routes);

module.exports = App