import {Request , Response, Router} from 'express'
import {Axios} from 'axios'

const routes = Router();

import {UsuarioController} from '../controllers/UsuarioController'
import {DepositoController} from '../controllers/DepositoController'
import {LevantamentoController} from '../controllers/LevantamentoController';
import {TimesController} from '../controllers/TimesController'

routes.get('/',async (request: Request, response: Response)=>{
    return response.status(200).json({
        message:"sucesso"
    })
});

//API Externa
const APIkey ='2dad5d1ec71e86c9cf213e39c9a5865857706ad582273ba35064a7f32cfb4026';

routes.get('/api/paises',async (request: Request, response: Response)=>{
    try {
        const requestOptions = {
            method: "GET",
            type:'cors',
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
                }
            };
            const result = await fetch(`https://apiv3.apifootball.com/?action=get_countries&APIkey=${APIkey}`, 
            requestOptions
            );
            const data = await result.json();
            return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json(error);
    }
});

routes.get('/api/pais/:id',async (request: Request, response: Response)=>{
    const ID = request.params.id.trim();
    try {
        const requestOptions = {
            method: "GET",
            type:'cors',
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
            };
            const result = await fetch(`https://apiv3.apifootball.com/?action=get_countries&country_id=${ID}&APIkey=${APIkey}`, 
            requestOptions
            );
            const data = await result.json();
            return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json(error);
    }
});

routes.get('/api/ligas/pais/:id',async (request: Request, response: Response)=>{
    const ID = request.params.id.trim();
    try {
        const requestOptions = {
            method: "GET",
            type:'cors',
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
            };
            const result = await fetch(`https://apiv3.apifootball.com/?action=get_leagues&country_id=${ID}&APIkey=${APIkey}`, 
            requestOptions
            );
            const data = await result.json();
            return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json(error);
    }
});

routes.get('/api/ligas',async (request: Request, response: Response)=>{
    try {
        const requestOptions = {
            method: "GET",
            type:'cors',
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
            };
            const result = await fetch(`https://apiv3.apifootball.com/?action=get_leagues&APIkey=${APIkey}`, 
            requestOptions
            );
            const data = await result.json();
            return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json(error);
    }
});




//------------------- API Externa
//USUARIO
routes.post('/api/usuario', new UsuarioController().create);
routes.get('/api/usuarios', new UsuarioController().findAll);
routes.get('/api/usuario/:id', new UsuarioController().findById);
routes.delete('/api/usuario/:id', new UsuarioController().deleteById);
routes.put('/api/usuario/:id', new UsuarioController().update);


//Deposito
routes.post('/api/deposito', new DepositoController().create);
routes.get('/api/depositos', new DepositoController().findAll);
routes.get('/api/deposito/:id', new DepositoController().findById);
routes.delete('/api/deposito/:id', new DepositoController().deleteById);
routes.put('/api/deposito/:id', new DepositoController().update);


//Levantamento
routes.post('/api/levantamento', new LevantamentoController().create);
routes.get('/api/levantamentos', new LevantamentoController().findAll);
routes.get('/api/levantamento/:id', new LevantamentoController().findById);
routes.delete('/api/levantamento/:id', new LevantamentoController().deleteById);
routes.put('/api/levantamento/:id', new LevantamentoController().update);

//Times
routes.post('/api/times', new TimesController().create);
routes.get('/api/times', new TimesController().findAll);
routes.get('/api/times/:id', new TimesController().findById);
routes.delete('/api/times/:id', new TimesController().deleteById);
routes.put('/api/times/:id', new TimesController().update);

export { routes };