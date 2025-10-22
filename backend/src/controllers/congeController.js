import * as congeService from '../services/congeService.js';
export const createConge = async (req,res)=>{try{const c=await congeService.createConge(req.body);res.status(201).json(c);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getAllConges = async (req,res)=>{try{const l=await congeService.getAllConges();res.json(l);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getCongeById = async (req,res)=>{try{const c=await congeService.getCongeById(req.params.id);if(!c) return res.status(404).json({message:'Congé non trouvé'});res.json(c);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const updateConge = async (req,res)=>{try{const c=await congeService.updateConge(req.params.id, req.body);res.json(c);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const deleteConge = async (req,res)=>{try{await congeService.deleteConge(req.params.id);res.json({message:'Supprimé'});}catch(e){console.error(e);res.status(500).json({message:e.message});}};
