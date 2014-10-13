self.app.get("/entities/Taxi", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Taxi/instances')
    });
});
self.app.get("/entities/Taxi/instances", function(req, res) {
    return mongoose.model('Taxi').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Taxi/template", function(req, res) {
    res.json(new Taxi());
});
self.app.post("/entities/Taxi/instances", function(req, res) {
    var instanceData = req.body;
    var newTaxi = new Taxi();
    for (var p in instanceData) {
        newTaxi[p] = instanceData[p]; 
    }
    newTaxi.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
