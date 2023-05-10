import {Request , Response} from 'express'
import { prismaClient } from '../database/prismaClient';


export class DepositoController{
    async create(request: Request, response: Response){
        const {
            valor,iban, id, referencia
        } = request.body;
        
        try {
            const id_usuario = Number(id.trim()); 
            const service = await prismaClient.deposito.create({
                data:{
                    valor:String(valor).trim(), 
                    iban:String(iban).trim(),
                    referencia:String(referencia).trim(),
                    id_usuario
                }
            })
            return response.status(201).json(service);
            
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        } finally{
            await prismaClient.$disconnect();          
        }
            
    }

    async findAll(request: Request, response: Response){
        const service = await prismaClient.deposito.findMany();
        if(service instanceof Error){
            return response.status(500).json(service.message);
        }
        response.status(200).json(service);
    }

    async findById(request: Request, response: Response){
        const id = Number (request.params.id.trim());
        const service = await prismaClient.deposito.findFirst({
            where:{
                id
            }
        });
        if(service instanceof Error){
            return response.status(500).json(service.message);
        }
        response.status(200).json(service);
    }

    async deleteById(request: Request, response: Response){
        const id = Number (request.params.id.trim());
        const service = await prismaClient.deposito
        .delete({
            where:{
                id
            }
        });
        try {
            return response.status(200).json(service);
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        }finally{
            await prismaClient.$disconnect();
                      
        }
    }

    async update(request: Request, response: Response){
        const id = Number (request.params.id.trim());
        const {
            valor,iban, idUsuario, referencia
        } = request.body;
        
        try {
            const id_usuario = Number(idUsuario.trim()); 
            const service = await prismaClient.deposito.update({
                where:{
                    id
                },
                data:{
                    valor:String(valor).trim(), 
                    iban:String(iban).trim(),
                    referencia:String(referencia).trim(),
                    id_usuario
                }
            })
            return response.status(200).json(service);
            
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        } finally{
            await prismaClient.$disconnect();          
        }
            
    }

}