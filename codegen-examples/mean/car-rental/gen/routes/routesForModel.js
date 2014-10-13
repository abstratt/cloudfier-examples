self.app.get("/entities/Model", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Model/instances')
    });
});
self.app.get("/entities/Model/instances", function(req, res) {
    return mongoose.model('Model').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Model/template", function(req, res) {
    res.json(new Model());
});
self.app.post("/entities/Model/instances", function(req, res) {
    var instanceData = req.body;
    var newModel = new Model();
    for (var p in instanceData) {
        newModel[p] = instanceData[p]; 
    }
    newModel.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
