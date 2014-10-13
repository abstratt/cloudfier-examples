self.app.get("/entities/Make", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Make/instances')
    });
});
self.app.get("/entities/Make/instances", function(req, res) {
    return mongoose.model('Make').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Make/template", function(req, res) {
    res.json(new Make());
});
self.app.post("/entities/Make/instances", function(req, res) {
    var instanceData = req.body;
    var newMake = new Make();
    for (var p in instanceData) {
        newMake[p] = instanceData[p]; 
    }
    newMake.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
