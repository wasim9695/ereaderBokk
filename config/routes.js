module.exports = (router, app) => {
    // Admin Routes
    require('../routes/index')(router, app);
    require('../routes/admin')(router, app);
    require('../routes/fileupload')(router, app);
};