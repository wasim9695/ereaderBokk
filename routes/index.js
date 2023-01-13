const UsersController = require('../controller/user/authentication');
// const Authorization = require("../../middleware/auth");


module.exports = (router, app) => {
    router.get('/', (req, res, next) => {
      //  console.log("hrello");
    //    return false;
    return res.render('../view/index');
    });

   

   //  router.get('/listuser', (req, res, next) => {
   //  return res.render('../view/listmanagment');
   //  });

    router.get('/addfiles', (req, res, next) => {
      return res.render('../view/addfiles');
      });

      router.get('/addfileslist', (req, res, next) => {
         return res.render('../view/addfilelist');
         });
         router.get('/addbooks', (req, res, next) => {
            return res.render('../view/addbooks');
            });

            router.get('/addbookslist', (req, res, next) => {
               return res.render('../view/addbookslist');
               });
               router.get('/subscribe', (req, res, next) => {
                  return res.render('../view/subscribe');
                  });

                  router.get('/subscribelist', (req, res, next) => {
                     return res.render('../view/subscribelist');
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




    router.post('/signUp', (req, res, next) => {
      const authObj = (new UsersController()).boot(req, res);
      return authObj.signUp();
  });

  router.post('/signIn', (req, res, next) => {
      const authObj = (new UsersController()).boot(req, res);
      return authObj.signIn();
  });

  router.post('/forgotPassword', (req, res, next) => {
      const authObj = (new UsersController()).boot(req, res);
      return authObj.forgotPassword();
  });


  router.post('/addfiles', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.addfiles();
});
router.get('/getfiles', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.getfiles();
});
router.post('/addbooksAll', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.addbooks();
});
router.get('/getbooksAll', (req, res, next) => {
   const authObj = (new UsersController()).boot(req, res);
   return authObj.getBooks();
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
