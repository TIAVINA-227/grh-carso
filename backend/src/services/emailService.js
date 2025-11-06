// backend/src/services/emailService.js
import nodemailer from 'nodemailer';

// Configuration du transporteur email
const createTransporter = () => {
  // Vérifier si les variables d'environnement sont configurées
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️ Variables EMAIL_USER et EMAIL_PASSWORD non configurées');
    console.warn('📧 Les emails ne seront pas envoyés. Configurez votre .env');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // Ou 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Mot de passe d'application Gmail
    }
  });
};

// Envoyer email de bienvenue
export const envoyerEmailBienvenue = async (utilisateur, motDePasseTemporaire) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: utilisateur.email,
      subject: '🎉 Bienvenue sur Carso - Vos identifiants de connexion',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue sur Carso</h1>
              <p>Votre compte a été créé avec succès</p>
            </div>
            <div class="content">
              <p>Bonjour <strong>${utilisateur.prenom_utilisateur || utilisateur.nom_utilisateur}</strong>,</p>
              
              <p>Votre compte a été créé. Vous pouvez maintenant accéder à l'application Carso.</p>
              
              <div class="credentials">
                <h3>📋 Vos identifiants de connexion</h3>
                <p><strong>Email :</strong> ${utilisateur.email}</p>
                <p><strong>Mot de passe temporaire :</strong> <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">${motDePasseTemporaire}</code></p>
                <p><strong>Rôle :</strong> ${utilisateur.role}</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important :</strong> Pour des raisons de sécurité, vous devrez changer ce mot de passe lors de votre première connexion.
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
                  🚀 Se connecter à Carso
                </a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Si vous avez des questions, n'hésitez pas à contacter votre administrateur système.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Carso - Système de Gestion des Ressources Humaines</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Erreur envoi email:', error);
    // Ne pas bloquer la création de l'utilisateur si l'email échoue
    return { 
      success: false, 
      error: error.message,
      data: { email: utilisateur.email, password: motDePasseTemporaire }
    };
  }
};

// Envoyer email de réinitialisation de mot de passe
export const envoyerEmailResetPassword = async (utilisateur, token) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 EMAIL RESET PASSWORD NON ENVOYÉ (configuration manquante)');
      console.log('   Token:', token);
      return { success: false, message: 'Configuration email manquante' };
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: utilisateur.email,
      subject: '🔑 Réinitialisation de votre mot de passe - Carso',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Réinitialisation de mot de passe</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${utilisateur.prenom_utilisateur || utilisateur.nom_utilisateur}</strong>,</p>
              
              <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important :</strong> Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de reset envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Erreur envoi email reset:', error);
    return { success: false, error: error.message };
  }
};