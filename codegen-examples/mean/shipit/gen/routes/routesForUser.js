self.app.get("/entities/User", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/User/instances')
    });
});
self.app.get("/entities/User/instances", function(req, res) {
    return mongoose.model('User').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/User/template", function(req, res) {
    res.json(new User());
});
self.app.post("/entities/User/instances", function(req, res) {
    var instanceData = req.body;
    var newUser = new User();
    for (var p in instanceData) {
        newUser[p] = instanceData[p]; 
    }
    newUser.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
