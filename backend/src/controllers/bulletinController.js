import * as bulletinService from '../services/bulletinService.js';
export const createBulletin = async (req,res)=>{
    try{
        const b=await bulletinService.createBulletin(req.body);
        res.status(201).json(b);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

export const getAllBulletins = async (req,res)=>{
    try{
        const l=await bulletinService.getAllBulletins();
        res.json(l);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

export const getBulletinById = async (req,res)=>{
    try{
        const b=await bulletinService.getBulletinById(req.params.id);
        if(!b)return res.status(404).json({message:'Non trouvé'});
        res.json(b);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

export const updateBulletin = async (req,res)=>{
    try{
        const b=await bulletinService.updateBulletin(req.params.id, req.body)
        res.json(b);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};
export const deleteBulletin = async (req,res)=>{
    try{
        await bulletinService.deleteBulletin(req.params.id);
        res.json({message:'Supprimé'});
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};
