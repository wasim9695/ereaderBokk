const _ = require("lodash");

const Controller = require("../base");
const { Users } = require('../../models/Users');
const { Files } = require('../../models/Files');
const {BookAlls} = require('../../models/BookAlls');
const {Subscs} = require('../../models/Subscs');
const {Notofications} = require('../../models/Notifications');
const {Themes} = require('../../models/Theme');
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const Services = require('../../utilities/index');


class AdminController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }





    
    async signUp() {
        try {
          
            let fieldsArray =["fullName","dob","gender","emailId","mobileNo","password"];
            let emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.redirect('/users');
            }
            if(this.req.body.fullName){
                const validateName = await this.commonService.nameValidation(this.req.body.fullName);
                if(!validateName){
                    return this.res.redirect('/users');
                }
            }
            const validateEmail = await this.commonService.emailIdValidation(this.req.body.emailId);
            if(!validateEmail){
                return this.res.send({ status: 0, message: "Please send proper emailId" });
            }
            const validateMobileNo = await this.commonService.mobileNoValidation(this.req.body.mobileNo);
            if(!validateMobileNo){
                return this.res.send({ status: 0, message: "Mobile number should have 10 digits" });
            }
            const validatePassword = await this.commonService.passwordValidation(this.req.body.password);
            if(!validatePassword){
                return this.res.send({ status: 0, message: "Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character" });
            }
            
    
            const user = await Users.findOne({"emailId": this.req.body.emailId.toLowerCase()});

            //if user exist give error
            if (!_.isEmpty(user) && user.emailId) {
                return this.res.send({ status: 0, message: "Email already exists" });
            } else {
                let data = this.req.body;
                const transactionPassword = await this.commonService.randomGenerator(6);
                const encryptedPassword = await this.commonService.ecryptPassword({ password: data['password'] });
                data = { ...data, password: encryptedPassword, transactionPassword };
                data['emailId'] = data['emailId'].toLowerCase();
                let usersCount = await Users.count();
                if(usersCount <= 8){
                    usersCount = '0'+ (usersCount+1);
                }
                const randomText = (await this.commonService.randomGenerator(2,'number') +await this.commonService.randomGenerator(1,'capital')+await this.commonService.randomGenerator(2,'number') )
                data['registerId'] = 'S'+randomText+ usersCount
                // save new user
                const newUser = await new Model(Users).store(data);
                return this.res.render('../view/usermangement',{ status: 1, data: [] });
              
            }
        } catch (error) {
            console.log("error = ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }

    }


    async signUpUpdate(){
        try {
            // console.log(this.req.params.id);
            const data = this.req.body;
        await Users.findByIdAndUpdate(this.req.params.id, data);
        // alert("update Successully");
        const user = await Users.find();
        // console.log(user);
        // return res.render('../view/listmanagment');
        return this.res.render('../view/listmanagment',{ status: 1, data: user });
    } catch (error) {
        console.log(error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
    }
 

    async deleteData(){
        try {
            console.log(this.req.params.id);
        await Users.deleteOne({_id:this.req.params.id});
        // alert("update Successully");
        const user = await Users.find();
        // console.log(user);
        // return res.render('../view/listmanagment');
        return this.res.render('../view/listmanagment',{ status: 1, data: user });
    } catch (error) {
        console.log(error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
    }

    async deleteDataFile(){
        try {
            console.log(this.req.params.id);
        await Files.deleteOne({_id:this.req.params.id});
        // alert("update Successully");
        const newFiles = await Files.find();
        // console.log(user);
        // return res.render('../view/listmanagment');
        return this.res.render('../view/addfilelist',{ status: 1, data: newFiles }); 
    } catch (error) {
        console.log(error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
    }


    async signIn() {
        try {
            const data = this.req.body;
            if (data.emailId) {
                const fieldsArray = ["emailId", "password"];
                const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                }
                const user = await Users.findOne({$or:[{emailId: data.emailId.toString().toLowerCase()},{password: data.password}] , isDeleted: false, status:true });
                if (_.isEmpty(user)) {
                    return this.res.send({ status: 0, message: "User not exists or deleted" });
                }
            
                const status = await this.commonService.verifyPassword({ password: data.password, savedPassword: user.password });
                if (!status) {
                    return this.res.send({ status: 0, message: "Invalid password" });
                }

                const userDetails = await Users.findById({_id:user._id}).select({password:0, __v:0, transactionPassword:0});
                const { token, refreshToken } = await this.authentication.createToken({ id: user._id, role: userDetails.role, ipAddress: this.req.ip, device: this.req.device.type, action: "Login" });
                return this.res.send({ status: 1, message: "Login Successful", access_token: token, refresh_token: refreshToken, data: userDetails });
            }
            else if  (data.mobileNo) {
                const fieldsArray = ["mobileNo", "password"];
                const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                }
                const user = await Users.findOne({$or:[{mobileNo: data.mobileNo},{password: data.password}] , isDeleted: false, status:true });
                if (_.isEmpty(user)) {
                    return this.res.send({ status: 0, message: "User not exists or deleted" });
                }
            
                const status = await this.commonService.verifyPassword({ password: data.password, savedPassword: user.password });
                if (!status) {
                    return this.res.send({ status: 0, message: "Invalid password" });
                }

                const userDetails = await Users.findById({_id:user._id}).select({password:0, __v:0, transactionPassword:0});
                const { token, refreshToken } = await this.authentication.createToken({ id: user._id, role: userDetails.role, ipAddress: this.req.ip, device: this.req.device.type, action: "Login" });
                return this.res.send({ status: 1, message: "Login Successful", access_token: token, refresh_token: refreshToken, data: userDetails });
            }

            else if (data.grantType == "refreshToken") {
                const fieldsArray = ["refreshToken", "grantType"];
                const emptyFieldsRefresh = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFieldsRefresh && Array.isArray(emptyFieldsRefresh) && emptyFieldsRefresh.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFieldsRefresh.toString() + " fields required." });
                }
                const tokenStatus = await this.authentication.verifyRefreshToken(data);
                const userDetails = await Users.findById({ _id: tokenStatus.id }).select({ password: 0, __v: 0 });
                const { token, refreshToken } = await this.authentication.createToken({ id: userDetails._id, role: userDetails.role });
                return this.res.send({ status: 1, message: "Login Successful", access_token: token, refresh_token: refreshToken, data: userDetails });
            } else {
                return this.res.send({ status: 0, message: "Please send grantType fields required." });
            }
        } catch (error) {
            console.log(error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    async getProfiles(){
        try {
            const user = await Users.find();
            // console.log(user);
            // return res.render('../view/listmanagment');
            return this.res.render('../view/listmanagment',{ status: 1, data: user });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    async getProfilesID(){
        try {
            var id = this.req.params.id;
            const user = await Users.findOne({_id:id});
            //console.log(user);
            // return res.render('../view/listmanagment');
            return this.res.render('../view/usermangement',{ status: 1, data: user });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    async getAllBooksID(){
        try {
            var id = this.req.params.id;
            const file = await Files.findOne({_id:id});
            //console.log(user);
            // return res.render('../view/listmanagment');
            // encoding = 'utf8';
            const urls = './public/upload/'+file.file;
            console.log(urls);
            'use strict';
            // return this.res.send({ status: 1, data: file });
            // return false;
            const fs = require('fs');
           
            fs.readFile(urls, (err, data) => {
                // console.log(data);
               
                let student = JSON.parse(data);
                console.log(student);
                return this.res.render('../view/viewAllfile',{ status: 1, data: student });
            });
            // return this.res.send({ status: 1, data: student });
           
       
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }



     /********************************************************
    Purpose: Forgot password mail
    Parameter:
        {
            "userId":"emailId" or registerId
        }
    Return: JSON String
   ********************************************************/
    async forgotPassword() {
        try {
            const data = this.req.body;
            if(!data.userId){
                return this.res.send({ status: 0, message: "Please send userId" });
            }
            const user = await Users.findOne({$or:[{emailId: data.userId.toString().toLowerCase()},{registerId: data.userId}] , isDeleted: false, status:true }, {fullName:1,organisationName:1, countryId:1, role:1, mobileNo:1, emailId:1, registerId:1}).populate('countryId',{name:1});
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User not exists or deleted" });
            }
            const newPassword = await this.commonService.randomGenerator(6);
            const encryptedPassword = await this.commonService.ecryptPassword({ password: newPassword});
            await Users.findByIdAndUpdate(user._id, { password: encryptedPassword }, {upsert: true});

            const name = user.role == 'regular' ? user.fullName: user.organisationName
            // Sending email
            await this.services.sendEmail(user.emailId, "wasim", '',`<html><body><h2>HI! ${name} you have requested for a password change</h2><h3><strong>New password: </strong>${newPassword}</h3></body></html>`)
            const message = `Dear ${name}, Welcome to www.wasim.in Your User ID is ${user.registerId}, Your Password is ${newPassword}, Regards Strawberri World Solutions Private Limited.";`
            // Sending message
            if(user.countryId.name == 'India' && user.mobileNo){
                await this.services.sendSignupConfirmation(user.mobileNo, message)
            }
            return this.res.send({ status: 1, message: "Please check your registered email" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

//      
    async logOut() {
        try {
            const token = this.req.token;
            console.log("token", token)
            if (!token) {
                return this.res.send({ status: 0, message: "Please send the token"});
            }
            const auth = await AccessTokens.findOne({ token: token, userId: this.req.user });
            if (_.isEmpty(auth)) {
                return this.res.send({ status: 0, message: "Invalid token"});
            }
           
            const updateAuth = await AccessTokens.findByIdAndUpdate(auth._id, { token: "",refreshToken:"", action: 'Logout' }, { new: true });
            if (_.isEmpty(updateAuth)) {
                return this.res.send({ status: 0, message: "Failed to logout" });
            }
            return this.res.send({ status: 1, message: "Successfully logged out"});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    async addfiles() {
        try {
            let data = this.req.body;
            const fieldsArray = ["file","unicodes", "unicodebook"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }else{
                const newFiles = await new Model(Files).store(data);
                if (_.isEmpty(newFiles)) {
                    return this.res.send({ status: 0, message: "Files details not saved" })
                }
                return this.res.render('../view/addbookslist',{ status: 1, data: newFiles }); 
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    async getfiles(){
        try {
            const page = this.req.query.page || 1;
            const resultsPerPage = 10;
          
            // get the results for the current page, as shown above
            // Model.find({})
            //   .limit(resultsPerPage)
            //   .skip(resultsPerPage * (page - 1))
            //   .exec((err, results) => {
            //     // render the paginated results
            //     res.render('items', { results, page, resultsPerPage });
            //   });
            const FilesGet = await Files.find().limit(resultsPerPage)
            .skip(resultsPerPage * (page - 1));
            return this.res.render('../view/addfilelist',{ status: 1, data: FilesGet, page, resultsPerPage }); 
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    async addbooks() {
        try {
            let data = this.req.body;
            const fieldsArray = ["name"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }else{
                const newBookAlls = await new Model(BookAlls).store(data);
                if (_.isEmpty(newBookAlls)) {
                    return this.res.send({ status: 0, message: "Files details not saved" })
                }
                return this.res.render('../view/addbookslist',{ status: 1, data: newBookAlls });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    async getBooks(){
        try {

            const FilesGet = await BookAlls.find();
            return this.res.render('../view/addbookslist',{ status: 1, data: FilesGet }); 
            // return 
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    async addfilesall(){
        try {

            const FilesGet = await BookAlls.find();
            return this.res.render('../view/addfiles',{ status: 1, data: FilesGet }); 
            // return 
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    async deleteBookData(){
        try {
            // console.log(this.req.params.id);
        await BookAlls.deleteOne({_id:this.req.params.id});
        // alert("update Successully");
        const FilesGet = await BookAlls.find();
            return this.res.render('../view/addbookslist',{ status: 1, data: FilesGet });
    } catch (error) {
        console.log(error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
    }


    
    async addsubs() {
        try {
            let data = this.req.body;
            const fieldsArray = ["emailId","mobile", "typeBook"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }else{
                const newBookAlls = await new Model(Subscs).store(data);
                if (_.isEmpty(newBookAlls)) {
                    return this.res.send({ status: 0, message: "Files details not saved" })
                }
                return this.res.send({ status: 1, message: "Details added successfully"});
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    async getsubs(){
        try {

            const FilesGet = await Subscs.find();
            return this.res.send({ status: 1, data: FilesGet });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    async addnotification() {
        try {
            let data = this.req.body;
            const fieldsArray = ["email","mobile", "bookType"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }else{
                const newBookAlls = await new Model(Notofications).store(data);
                if (_.isEmpty(newBookAlls)) {
                    return this.res.send({ status: 0, message: "Files details not saved" })
                }
                return this.res.send({ status: 1, message: "Details added successfully"});
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    async getnotifications(){
        try {

            const FilesGet = await Notofications.find();
            return this.res.send({ status: 1, data: FilesGet });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    async addThemes() {
        try {
            let data = this.req.body;
            const fieldsArray = ["file","colorcode", "backgrounds"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }else{
                const newBookAlls = await new Model(Themes).store(data);
                if (_.isEmpty(newBookAlls)) {
                    return this.res.send({ status: 0, message: "Files details not saved" })
                }
                return this.res.send({ status: 1, message: "Details added successfully"});
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    async getThemes(){
        try {

            const FilesGet = await Themes.find();
            return this.res.send({ status: 1, data: FilesGet });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    

    
    
    

}
module.exports = AdminController;