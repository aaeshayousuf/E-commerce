import express from 'express';
import { activateUser, deleteUserById, getAllUsers, getCurrentUserProfile, getUserById, loginUser2, logOutCurrentUser, registerUser, updateCurrentUserProfile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeAdmin } from '../middlewares/authorizeAdmin.js';

const userRouter = express.Router();

    // userRouter.post('/register', createUser)
    userRouter.post('/register', registerUser);
    userRouter.post('/verify-user', activateUser);
    // userRouter.post('/login', loginUser);
    userRouter.post('/login-user', loginUser2);
    userRouter.post('/logout', logOutCurrentUser); 

    userRouter.get('/all', getAllUsers);
    userRouter.get('/profile', authenticate, getCurrentUserProfile);
    userRouter.get('/get-user/:id', authenticate, getUserById);

    userRouter.put('/profile', authenticate, updateCurrentUserProfile);

    userRouter.delete("/:id", authenticate, authorizeAdmin, deleteUserById);
    
    export default userRouter; 