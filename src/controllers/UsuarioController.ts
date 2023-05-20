import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';
import { sign } from "jsonwebtoken";
import {compare, hash} from 'bcryptjs';


export class UsuarioController{
    async create(request: Request, response: Response){
        const {
            nome, pais, iban
        } = request.body;
        
        try {
             
                const service = await prismaClient.usuario.create({
                    data:{
                        nome:String(nome).trim(), 
                        iban:String(iban).trim(),
                        pais:String(pais).trim()
                    }
                })
                
                return response.status(201).json(service);
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message)
                return response.status(500).json(error.message);
            }
        } finally{
            await prismaClient.$disconnect();
                      
        }
            
    }

    async login(request: Request, response: Response){
        const {email,password }= request.body;
        
        const token = await new UsuarioServices().loginService(email, password);
        if(token instanceof Error){
            return response.status(500).json({"Error: ": token.message});
        }
        else{
            return response.status(200).json(token);
        }
        
    }

    async findAll(request: Request, response: Response){
        const usuario = await prismaClient.usuario.findMany();
        if(usuario instanceof Error){
            return response.status(500).json(usuario.message);
        }
        response.status(200).json(usuario);
    }

    async findById(request: Request, response: Response){
        const id = Number(request.params.id.trim())
        const usuario = await prismaClient.usuario.findFirst({
            where:{
                id
            }
        });
        if(usuario instanceof Error){
            return response.status(500).json(usuario.message);
        }
        response.status(200).json(usuario);
    }

    async deleteById(request: Request, response: Response){
        const id = Number (request.params.id);
        const usuario = await prismaClient.usuario.delete({
            where:{
                id
            }
        });
        try {
            return response.status(200).json(usuario);
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
            nome, pais, iban
        } = request.body;
        const id = Number(request.params.id.trim());
        try {
            let usuario = await prismaClient.usuario.findFirst({
                where:{ //verificar se existe um usuario com o este id
                    id
                }}
            );
            if(!usuario){
                return response.status(404).json(new Error("ERRO: NOT FOUND : Usuário!").message);
            }
            else{
                
                const service = await prismaClient.usuario.update({
                    where:{
                        id
                    },
                    data:{
                        nome:String(nome).trim(), 
                        pais:String(pais).trim(),
                        iban:String(iban).trim()
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

    //METODOS AUXILIARES

    
}