const User = require('../models/user');
const bcrypt = require('bcrypt');
const EmailSender = require('../utils/EmailSender');
const TokenManager = require('../utils/TokenManager');
const Institution = require('../models/institution');

const emailSender = new EmailSender();
const tokenManager = new TokenManager();

const login = async function(req,res,next){
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        if(!user.verified || user.blocked){
            return res.status(400).json({ message: 'User should verify or unblock account.' });
        }

        const token = tokenManager.generateToken(user._id);
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: 'Login successful', token });
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
      }
    }

const signup = async function(req,res,next){
    try {
        const { email, password, name, surname, address, institutionId, role} = req.body;

        const institution = await Institution.findById(institutionId);

        if(!institution){
          return res.status(400).json({ message: 'Invalid institution' });
        }  

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        let user = await User.findOne({email});
        if (user) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate verification code

        user = new User({ email, password, name, surname, address, verificationCode, role, role});
        user.institutionId = institution;
        const isSuccess = emailSender.sendEmail(email, "Verification", "Your verification code is " + verificationCode + ".")
        if(!isSuccess){
            throw new Error("Error when sending email.");
        };
        await user.save();
        return res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
      }
}

const verifyUser = async function(req, res, next) {
    try {
        const { email, verificationCode } = req.body;

        const user = await User.findOne({ email, verificationCode });
        if (!user) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        user.verified = true;
        await user.save();

        return res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}


const userDetail = async function (req, res, next) {
  try {
    
    const id = req.authanticatedUserId;
    var authUser = await User.findById(id, '-password');
    
    if (!authUser) {
      return res.status(400).json({ message: 'User not found.' });
    }

    return res.status(200).json({user : authUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
}

const getUserOwnedProject = async function (req, res, next) {
  try {

    const id = req.authanticatedUserId;
    var authUser = await User.findById(id, '-password')
    .populate("ownedProjectIds collaboratedProjectIds")

    if (!authUser) {
      return res.status(400).json({ message: 'User not found.' });
    }

    var ownedProjects = authUser.ownedProjectIds;
    var collaboratedProjects = authUser.collaboratedProjectIds;


    var populatedOwnedProjects = await Promise.all(ownedProjects.map(async (project) => {
      return await project.populate("tagIds");
    }));

    var populatedCollaboratedProjects = await Promise.all(collaboratedProjects.map(async (project) => {
      return await project.populate("tagIds");
    }));

    var populatedProjects = populatedCollaboratedProjects.concat(populatedOwnedProjects);

    return res.status(200).json({ projects: populatedProjects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}


const getUserNameFromId = async function (req, res, next) {
  try {

    const userId = req.query.userId;
    var userNameInfo = await User.findById(userId, "name surname email institutionId");

    if (!userNameInfo) {
      return res.status(400).json({ message: 'User not found.' });
    }

    return res.status(200).json({ userNameInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Id is not in id format' });
  }
}


const getUserSharedProjects = async function (req, res, next) {
  try {

    const id = req.authanticatedUserId;
    var authUser = await User.findById(id).select('-password').populate("sharedProjectIds");;

    if (!authUser) {
      return res.status(400).json({ message: 'User not found.' });
    }

    var projects = authUser.sharedProjectIds;

    var populatedProjects = await Promise.all(projects.map(async (project) => {
      return await project.populate("tagIds");
    }));

    return res.status(200).json({ projects: populatedProjects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}

const forgotPassword = async function (req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000); // Generate verification code

    user.verificationCode = resetCode;

    const isSuccess = emailSender.sendEmail(email, "Password Reset", "Your reset code is " + resetCode + ".");
    if (!isSuccess) {
      throw new Error("Error when sending email.");
    };
    await user.save();
    return res.status(200).json({ message: 'Sent code to your email address.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}

const resetPassword = async function (req, res, next) {
  try {
    const { email, newPassword, resetCode} = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (resetCode == null || user.verificationCode != resetCode){
      user.verificationCode = null;
      await user.save();
      return res.status(400).json({ message: 'Wrong code. Please try with new one.' });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: 'Password successfully changed.'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}

const editUserProfile = async function (req, res, next) {
  try {
    const id = req.authanticatedUserId;
    var authUser = await User.findById(id, '-password');
    const { name, surname, role, institutionId, address } = req.body;

    const updatedUserProfile = await User.findByIdAndUpdate(id, {
      name: name,
      surname: surname,
      role: role,
      institutionId: institutionId,
      address: address
    }, { new: true });

    if (!updatedUserProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User profile updated successfully', user: updatedUserProfile });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}



module.exports = { login, signup, verifyUser, userDetail, getUserOwnedProject, getUserNameFromId, getUserSharedProjects, forgotPassword, editUserProfile, resetPassword}