//backend/src/routes/notificationRoutes.js
import express from "express";
import { verifyToken } from "../midleware/authMidllewares.js";
import {
  listMyNotifications,
  markOneAsRead,
  markAllAsReadController,
  deleteNotificationController,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", listMyNotifications);
router.patch("/read-all", markAllAsReadController);
router.patch("/:id/read", markOneAsRead);
router.delete("/:id", deleteNotificationController);

export default router;

