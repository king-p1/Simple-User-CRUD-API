import User from "../models/User.js";
import validator from 'validator';
import asyncHandler from 'express-async-handler';
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


//POST REQUEST 
const registerUser = asyncHandler(async (req, res) => {  
    try {
        const { username, email, password } = req.body;
      
        if (!email || !password || !username) {
            return res.status(400).json({ mssg: 'Please provide an email, password, and username' });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ mssg: 'Please provide a valid email' });
        }
        
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ mssg: 'Password not strong enough, must contain uppercase and lowercase letters with numbers and special characters' });
        }
    
        const userExists = await User.findOne({ username });  
        const emailExists = await User.findOne({ email });
    
        if (userExists) {
            return res.status(400).json({ mssg: 'User already exists with the same username' });
        }
    
        if (emailExists) {
            return res.status(400).json({ mssg: 'User already exists with current email' });
        }
       
        const newUser = await User.create({
            username, email, password
        });
      
        res.status(201).json({
            mssg: 'User Registered Successfully',
            user: {
                id:newUser.id,
                userID: newUser.userID, // Access the generated userID here
                username: newUser.username,
                email: newUser.email
            }
        });
        
    } catch (err) {
        res.status(400).json({ mssg: 'Invalid user data', err });
    }
});




// GET REQUESTS
const getUsers = asyncHandler( async (req, res) => { 
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.status(200).json({"Users":users});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

const getSingleUserWithName = asyncHandler( async (req, res) => { 
    const { username } = req.params;

    try {
        if(!username){
            res.status(501).json({mssg: 'Invalid Username'})
        }
        const user = await  User.findOne({ username }).select('-password') 
        if(!user) return res.status(501).json({ error : "Couldn't Find the User"});
          return   res.status(201).json({"User":user})
        
        
            } catch (error) {
                res.status(400).json({mssg: ' Cannot fetch User data '})
            }
  });

const getSingleUserWithUserID = asyncHandler( async (req, res) => { 
    const { userID } = req.params;

    try {
        if(!userID){
            res.status(501).json({mssg: 'Invalid UserID'})
        }
        const user = await  User.findOne({ userID }).select('-password') 
        if(!user) return res.status(501).json({ error : "Couldn't Find the User"});
          return   res.status(201).json({"User":user})
        
        
            } catch (error) {
                res.status(400).json({mssg: ' Cannot fetch User data '})
            }
  });

const getUser = asyncHandler( async (req, res) => { 
    const { username,userID } = req.params;

    try {
        if(!username){
            res.status(501).json({mssg: 'Invalid UserID'})
        }

        if(!userID){
            res.status(501).json({mssg: 'Invalid UserID'})
        }
        const user = await  User.findOne({ username,userID }).select('-password') 
        if(!user) return res.status(501).json({ error : "Couldn't Find the User"});
          return   res.status(201).json({"User":user})
        
        
            } catch (error) {
                res.status(400).json({mssg: ' Cannot fetch User data '})
            }
  });
// GET REQUESTS





// PUT REQUESTS


const updateUser = asyncHandler(async (req, res) => {
    try {
      const { id, username } = req.params;
  
      if (!id || !username) {
        return res.status(400).json({ error: 'Please provide both id and username' });
      }
  
      const body = req.body;
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: id, username },
        body,
        { new: true, runValidators: true }
      ).select('-password') 
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.status(200).json({ mssg: 'User Record Updated', "User": updatedUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });




  const resetPassword = asyncHandler(async (req, res) =>{
    try {
 const { id, username } = req.params;

const {password } = req.body;

    const user = await User.findOne({ id,username });

    if (!user) {
        return res.status(404).send({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
        { password: hashedPassword }
    );

return res.status(201).json({ msg: "Password  Updated...!" });
       
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
})



// PUT REQUESTS



// DELETE REQUESTS

const deleteUser = async (req, res) => {
    const {id, username } = req.params;

    if (!id || !username) {
        return res.status(400).json({ error: 'Please provide both id and username' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid userID format' });
    }

    try {
        const user = await User.findOneAndDelete({ _id: id, username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            mssg: 'User deleted successfully',
            "User": user
        });
    } catch (err) {
        return res.status(500).json({ error: 'Server error', details: err });
    }
};


// DELETE REQUESTS




export { registerUser,getUsers,
    getSingleUserWithName,getSingleUserWithUserID,
    getUser,deleteUser,updateUser,resetPassword };
