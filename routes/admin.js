const AdminController = require('../controller/admin/Admin');
// const Authorization = require("../../middleware/auth");



module.exports = (router, app) => {
    router.get('/', (req, res, next) => {
      //  console.log("hrello");
    //    return false;
    return res.render('../view/index');
    });


         
    router.post('/login', (req, res, next) => {
      // console.log(req);
      if(req.body.username=='admin' && req.body.pass=='admin@123'){
         return res.redirect('/users');
      }else{
         console.log("error");
      }
    //    return false;
    
    });


    router.get('/users', (req, res, next) => {
      //  console.log("hrello");
    //    return false;
    return res.render('../view/usermangement',{ status: 1, data: [] });
    });

    router.post('/signUpWeb', (req, res, next) => {
      const authObj = (new AdminController()).boot(req, res);
      return authObj.signUp();
  });

  router.post('/signUpWebUpdate/:id', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.signUpUpdate();
});
router.all('/deleteDatas/:id', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.deleteData();
});

router.all('/deleteDatasFile/:id', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.deleteDataFile();
});


  router.post('/signIn', (req, res, next) => {
      const authObj = (new AdminController()).boot(req, res);
      return authObj.signIn();
  });

  router.post('/forgotPassword', (req, res, next) => {
      const authObj = (new AdminController()).boot(req, res);
      return authObj.forgotPassword();
  });


  router.post('/addfiless', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.addfiles();
});



router.get('/addfilesall', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.addfilesall();
   });
   router.get('/viewfilesall', (req, res, next) => {
      const authObj = (new AdminController()).boot(req, res);
      return authObj.getfiles();
      });
      

      router.get('/viewfilesall/:id', (req, res, next) => {
         const authObj = (new AdminController()).boot(req, res);
         return authObj.getAllBooksID();
       })

   



router.get('/listuser', (req, res, next) => {
    const authObj = (new AdminController()).boot(req, res);
    return authObj.getProfiles();
 });

 router.get('/listuser/:id', (req, res, next) => {
    const authObj = (new AdminController()).boot(req, res);
    return authObj.getProfilesID();
 });



router.get('/getfiles', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.getfiles();
});




router.post('/addbooksAll', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.addbooks();
});
router.get('/getbooksAlls', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.getBooks();
});


router.all('/deletebook/:id', (req, res, next) => {
   const authObj = (new AdminController()).boot(req, res);
   return authObj.deleteBookData();
});



router.post('/addsubsall', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.addsubs();
});
router.get('/getsubsall', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.getsubs();
});
router.post('/addnotify', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.addnotification();
});
router.get('/getnotify', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.getnotifications();
});
router.post('/addthems', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.addThemes();
});
router.get('/getthems', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.getThemes();
});



  

  // router.post('/resetPassword', (req, res, next) => {
  //     const authObj = (new UsersController()).boot(req, res);
  //     return authObj.resetPassword();
  // });

  router.get('/logOut',(req, res, next) => {
      const authObj = (new UsersController()).boot(req, res);
      return authObj.logOut();
  });


}
