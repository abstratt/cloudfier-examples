self.app.get("/entities/Work", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Work/instances')
    });
});
self.app.get("/entities/Work/instances", function(req, res) {
    return mongoose.model('Work').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Work/template", function(req, res) {
    res.json(new Work());
});
self.app.post("/entities/Work/instances", function(req, res) {
    var instanceData = req.body;
    var newWork = new Work();
    for (var p in instanceData) {
        newWork[p] = instanceData[p]; 
    }
    newWork.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
