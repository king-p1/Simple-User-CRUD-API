import {Router} from 'express'
import { getUsers, registerUser , getSingleUserWithName ,
    getSingleUserWithUserID,getUser,deleteUser, 
    updateUser,
    resetPassword} from '../controllers/userControllers.js'

const router = Router()

// POST REQUEST
router.post('/register',registerUser)


// GET REQUEST
router.get('/get-all-users',getUsers)
router.get('/get-single-user/:username/:userID',getUser)
router.get('/get-single-user-with-name/:username',getSingleUserWithName)
router.get('/get-single-user-with-userID/:userID',getSingleUserWithUserID)


// PUT REQUEST
router.put('/update-user/:username/:id',updateUser)
router.put('/reset-password/:username/:id',resetPassword)


// DELETE REQUEST
router.delete('/delete-user/:username/:id',deleteUser)


export default router