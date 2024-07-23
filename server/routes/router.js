const express = require('express');
const route = express.Router();

const services = require('../services/render');
const userController = require('../controller/userController')
const taskController = require('../controller/taskController')

const middleware = require('../middleware/middleware')

route.get('/',middleware.isUserAuthenticated,services.homeRoute)
route.get('/login',middleware.isUserNotAuthenticated,services.loginRoute)
route.get('/register',middleware.isUserNotAuthenticated,services.registerRoute)

route.get('/api/displayTask',taskController.displayTask)  
route.get('/api/search', taskController.searchTasks);
route.get('/api/sort', taskController.sortTasks);

route.post('/api/login',userController.loginUser)   // Login 
route.post('/api/logout',userController.userLogout)   // Logout
route.post('/api/register',userController.registerUser)   // register 

route.post('/api/addTask',taskController.addTask)  
route.post('/api/updateStatus', taskController.updateStatus);


route.put('/api/editTask/:taskId', taskController.editTask);

route.delete('/api/deleteTask/:taskId', taskController.deleteTask);








module.exports = route
