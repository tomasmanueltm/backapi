import {Request , Response} from 'express'
import { prismaClient } from '../database/prismaClient';
import { gerarToken } from 'src/utils/GerarToken';
import {compare, hash} from 'bcryptjs';

export class LoginController{
    

    async login(request: Request, response: Response){
    
        const {
            senha,telefone
        } = request.body;
        try {
            const dados = await prismaClient.login.findFirstOrThrow({
                where:{
                    telefone:telefone.trim()
                }
            })
            console.log(dados);
            if (!dados) {
                return response.status(404).json(new Error("NOT FOUND : PHONE NUMBER!"));
            }
            const passwordMatch = await compare(senha.trim(), String(dados.senha));
            
            if (!passwordMatch) {
                return response.status(400).json(new Error("BAD REQUEST : PASSWORD IS WRONG!"));
            }
          
            const token = gerarToken(dados.id_usuario);
            

            return { token };
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