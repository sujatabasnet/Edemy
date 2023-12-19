//each route may do a lot of functions
//not appropriate to write everything inside the route
//for each route we can create another controller function
import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import {nanoid} from 'nanoid'


const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be minimum 6 characters long");
    }

    let userExist = await User.findOne({ email }).exec(); //await statements are onlt used in asynchronous functions
    if (userExist) return res.status(400).send("Email is taken");

    //hashPassword
    const hashedPassword = await hashPassword(password);

    //register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("saved user", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  try {
    //retrieve email and password from req body
    const { email, password } = req.body;

    // //check if database has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found!");

    //check password
    const match = await comparePassword(password, user.password); //the first is the plain version obtained from req body, second is hashed version stored in db
    if(!match) return res.status(400).send('Wrong password');
    
    //create signed JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //send user and token to client, exclude hashed password
    user.password = undefined;

    //send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      //secure: true, //only works on https(in production mode)
    });

    //send user as json response
    res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const sendTestEmail = async (req, res) => {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ["basnetsujata002@gmail.com"],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <h1>Reset Password link</h1>
              <p>Please use the following link to reset your password</p>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset link",
      },
    },
  };

  const emailSent = SES.sendEmail(params).promise();

  emailSent
    .then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email }, //first find the user based on the email
      { passwordResetCode: shortCode } //second is the property of the user model that we want to update
    );
    if(!user) return res
    .status(400)
    .send("User not found"); 
    //prepare for email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data:`
              <html>
                <h1>Reset password</h1>
                <p>Use this code to reset your password</p>
                <h2 style="color:red;">${shortCode}</h2>
                <i>edemy.com</i>
              </html>
            `,
          }
        },
        Subject: {
        Charset: 'UTF-8',
        Data: "Reset password",
      },
      },
    };
    
    const emailSent = SES.sendEmail(params).promise();
    emailSent
    .then((data) => {
      console.log(data);
      res.json({ok: true});
    })
    .catch((err) => {
      console.log(err);
    })
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async(req, res) => {
  try{  
    const {email, code, newPassword} = req.body
    // console.table({email, code, newPassword});
    const hashedPassword = await hashPassword(newPassword);
    const user = User.findOneAndUpdate({
      email, 
      passwordResetCode: code,
    }, {
      password: hashedPassword,
      passwordResetCode: "",
    }).exec();
    res.json({ok: true});
  } catch(err){
    console.log(err);
    return res
    .status(400)
    .send("Error! Try again.");
  }
}
