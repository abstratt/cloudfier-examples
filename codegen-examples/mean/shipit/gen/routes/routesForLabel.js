self.app.get("/entities/Label", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Label/instances')
    });
});
self.app.get("/entities/Label/instances", function(req, res) {
    return mongoose.model('Label').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Label/template", function(req, res) {
    res.json(new Label());
});
self.app.post("/entities/Label/instances", function(req, res) {
    var instanceData = req.body;
    var newLabel = new Label();
    for (var p in instanceData) {
        newLabel[p] = instanceData[p]; 
    }
    newLabel.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
