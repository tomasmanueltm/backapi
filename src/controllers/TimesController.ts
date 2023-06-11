import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';

import { validationResult } from 'express-validator';


export class TimesController{
    async create(request: Request, response: Response){
        const {
            adversario, casa,probabilidadeCasa, probabilidadeAdversario, empate
        } = request.body;
        
        try {
            const service =await prismaClient.times.create({
                data:{
                    adversario:String(adversario).trim(), 
                    casa:String(casa).trim(),
                    probabilidade_casa:String(probabilidadeCasa).trim(),
                    probabilidade_adversario:String(probabilidadeAdversario).trim(),
                    empate:String(empate).trim(),
                  
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
        const service = await prismaClient.times.findMany();
        if(service instanceof Error){
            return response.status(500).json(service.message);
        }
        response.status(200).json(service);
    }

    async findById(request: Request, response: Response){
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id = Number (request.params.id.trim());
        const service = await prismaClient.times.findFirst({
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
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id = Number (request.params.id.trim());
        const service = await prismaClient.times
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
            adversario, casa,probabilidadeCasa, probabilidadeAdversario, empate
        } = request.body;
        const id = Number(request.params.id.trim())
        try {
            const service =await prismaClient.times.update({
                where:{
                    id
                },
                data:{
                    adversario:String(adversario).trim(), 
                    casa:String(casa).trim(),
                    probabilidade_casa:String(probabilidadeCasa).trim(),
                    probabilidade_adversario:String(probabilidadeAdversario).trim(),
                    empate:String(empate).trim(),
                  
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