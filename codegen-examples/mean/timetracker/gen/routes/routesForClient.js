self.app.get("/entities/Client", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Client/instances')
    });
});
self.app.get("/entities/Client/instances", function(req, res) {
    return mongoose.model('Client').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Client/template", function(req, res) {
    res.json(new Client());
});
self.app.post("/entities/Client/instances", function(req, res) {
    var instanceData = req.body;
    var newClient = new Client();
    for (var p in instanceData) {
        newClient[p] = instanceData[p]; 
    }
    newClient.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
