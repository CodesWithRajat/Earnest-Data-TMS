import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  toggleTask,
  updateTask
} from "../controllers/taskController.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listTasks));
router.post("/", asyncHandler(createTask));
router.get("/:id", asyncHandler(getTask));
router.patch("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));
router.patch("/:id/toggle", asyncHandler(toggleTask));

export default router;
