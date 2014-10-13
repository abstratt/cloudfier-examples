self.app.get("/entities/Driver", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Driver/instances')
    });
});
self.app.get("/entities/Driver/instances", function(req, res) {
    return mongoose.model('Driver').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Driver/template", function(req, res) {
    res.json(new Driver());
});
self.app.post("/entities/Driver/instances", function(req, res) {
    var instanceData = req.body;
    var newDriver = new Driver();
    for (var p in instanceData) {
        newDriver[p] = instanceData[p]; 
    }
    newDriver.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
