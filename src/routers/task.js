const express = require('express');
const auth = require("../middleware/auth");
const TaskController = require("../controllers/TaskController");
const router = new express.Router();


router.post("/tasks", auth, TaskController.createTask);

router.get("/tasks", auth, TaskController.getTasks);

router.get("/tasks/:id", auth, TaskController.getTaskById);

router.patch("/tasks/:id", auth, TaskController.updateTask);

router.delete("/tasks/:id", auth, TaskController.deleteTask);

module.exports = router;