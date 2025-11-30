@echo off
echo 🔄 Régénération du client Prisma...
npx prisma generate
echo ✅ Client Prisma régénéré avec succès!
echo.
echo Vous pouvez maintenant redémarrer votre serveur avec: npm run dev

