import {Request , Response} from 'express'
import { prismaClient } from '../database/prismaClient';
import { sign } from "jsonwebtoken";
import {compare, hash} from 'bcryptjs';

export class LoginController{
    
    async create(request: Request, response: Response){
        const {
            idUsuario,email,telefone,senha, exp
        } = request.body;
        try {
            const usuario = await prismaClient.usuario.findFirst({
                where:{ //verificar se existe um usuario com o este id
                    id:Number(idUsuario.trim())
                }}
            );
            if(!usuario){
                return new Error("ERRO: Usuário don't exists, please create a user!");
            }
            else{
                const passwordHash = await hash(senha.trim(), 8);
                const token = sign({}, String(process.env.SECRET_JWT), {
                    subject: String(idUsuario.trim()),
                });
                const service = prismaClient.login.create({
                    data:{
                        id_usuario:Number(idUsuario.trim()),
                        email,
                        telefone,
                        senha:passwordHash, 
                        token,
                        exp
                    }
                })
                return service;
            }
        } catch (error) {
            return error;
        } finally{
            await prismaClient.$disconnect();
        }   
    }

    async loginService(request: Request, response: Response){
    
        const {
            idUsuario,senha,email
        } = request.body;
        try {
            const login = await prismaClient.login.findFirstOrThrow({
                where:{
                    id_usuario:Number(idUsuario.trim())
                }
            })
            console.log(login);
            if (!login) {
                return new Error("login does not exists!");
            }
            const passwordMatch = await compare(senha.trim(), String(login.senha));
            
            if (!passwordMatch) {
                return new Error("Error: Password incorrect!");
            }
          
            const token = sign({}, String(process.env.SECRET_JWT), {
                subject: String(login.id_usuario),
            });
            return { login, token };
        } catch (error) {
            return error;
        } finally{
            await prismaClient.$disconnect();
        }
        
    }
    
    async findAll(request: Request, response: Response){
        const login = await prismaClient.login.findMany();
        if(login instanceof Error){
            return response.status(500).json(login.message);
        }
        return response.status(200).json(login);
    }

    async findByIdUsuario(request: Request, response: Response){
        const id = Number(request.params.id.trim())
        const login = await prismaClient.login.findFirst({
            where:{
                id_usuario:id
            }
        });
        if(login instanceof Error){
            return response.status(500).json(login.message);
        }
        return response.status(200).json(login);
    }

    async deleteById(request: Request, response: Response){
        const id = Number (request.params.id);
        const login = await prismaClient.login.delete({
            where:{
                id_usuario:id
            }
        });
        try {
            return response.status(200).json(login);
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        }finally{
            await prismaClient.$disconnect();
                      
        }
    }

    async update(request: Request, response: Response){
        const {
            email,telefone,senha, exp
        } = request.body;
        const id = Number(request.params.idUsuario.trim());
        try {
            let usuario = await prismaClient.login.findFirst({
                where:{ //verificar se existe um usuario com o este id
                    id_usuario:id
                }}
            );
            if(!usuario){
                return response.status(500).json(new Error("ERRO: Usuário don't exist!").message);
            }
            else{
                const passwordHash = await hash(senha.trim(), 8);
                const service = await prismaClient.login.update({
                    where:{
                        id_usuario:id
                    },
                    data:{
                        id_usuario:id,
                        email,
                        telefone,
                        senha:passwordHash,
                        exp
                    }
                })
                
                return response.status(200).json(service);
            }
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        } finally{
            await prismaClient.$disconnect();
                      
        }
            
    }
}