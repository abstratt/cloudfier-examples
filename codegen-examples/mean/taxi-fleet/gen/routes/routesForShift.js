self.app.get("/entities/Shift", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Shift/instances')
    });
});
self.app.get("/entities/Shift/instances", function(req, res) {
    return mongoose.model('Shift').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Shift/template", function(req, res) {
    res.json(new Shift());
});
self.app.post("/entities/Shift/instances", function(req, res) {
    var instanceData = req.body;
    var newShift = new Shift();
    for (var p in instanceData) {
        newShift[p] = instanceData[p]; 
    }
    newShift.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
