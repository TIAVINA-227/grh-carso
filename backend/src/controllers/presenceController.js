import * as presenceService from '../services/presenceService.js';
export const createPresence = async (req,res)=>{try{const p=await presenceService.createPresence(req.body);res.status(201).json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getAllPresences = async (req,res)=>{try{const l=await presenceService.getAllPresences();res.json(l);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getPresenceById = async (req,res)=>{try{const p=await presenceService.getPresenceById(req.params.id);if(!p) return res.status(404).json({message:'Présence non trouvée'});res.json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const updatePresence = async (req,res)=>{try{const p=await presenceService.updatePresence(req.params.id, req.body);res.json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const deletePresence = async (req,res)=>{try{await presenceService.deletePresence(req.params.id);res.json({message:'Supprimé'});}catch(e){console.error(e);res.status(500).json({message:e.message});}};
