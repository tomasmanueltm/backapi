import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';

import { validationResult } from 'express-validator';


export class LevantamentoController{
    async create(request: Request, response: Response){
        const {
            valor, id
        } = request.body;
        
        try {
            const id_usuario = Number(id.trim()); 
            const service = await prismaClient.levantamento.create({
                data:{
                    valor:String(valor).trim(), 
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
        const service = await prismaClient.levantamento.findMany();
        if(service instanceof Error){
            return response.status(500).json(service.message);
        }
        response.status(200).json(service);
    }

    async deleteById(request: Request, response: Response){
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id = Number (request.params.id);
        const service = await prismaClient.levantamento
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
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const {
            valor, idUsuario
        } = request.body;
        const id = Number(request.params.id.trim());

        try {
            const id_usuario = Number(idUsuario.trim()); 
            const service = await prismaClient.levantamento.update({
                where:{id},
                data:{
                    valor:String(valor).trim(), 
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

    async findById(request: Request, response: Response){
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id = Number(request.params.id.trim());
        try {
            const service = await prismaClient.levantamento.findFirst({
                where:{
                    id
                }
            });
            response.status(200).json(service);
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        } finally{
            await prismaClient.$disconnect();
        }
       
    }

}