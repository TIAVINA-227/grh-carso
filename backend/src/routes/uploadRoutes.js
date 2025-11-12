// backend/routes/upload.routes.js
import express from 'express';
import { upload } from '../config/cloudinaryConfig.js';
import { verifyToken } from '../midleware/authMidllewares.js';
import cloudinary from '../config/cloudinaryConfig.js';

const router = express.Router();

// ✅ Route pour uploader un avatar
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    console.log('📤 Image uploadée sur Cloudinary:', req.file.path);

    res.status(200).json({
      success: true,
      message: 'Image uploadée avec succès',
      url: req.file.path,
      public_id: req.file.filename
    });

  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
});

// ✅ Route pour supprimer un avatar
router.delete('/avatar/:publicId', verifyToken, async (req, res) => {
  try {
    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);
    
    const result = await cloudinary.uploader.destroy(decodedPublicId);
    
    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image supprimée avec succès'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur suppression Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

export default router;