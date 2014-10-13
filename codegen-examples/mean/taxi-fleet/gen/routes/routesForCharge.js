self.app.get("/entities/Charge", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Charge/instances')
    });
});
self.app.get("/entities/Charge/instances", function(req, res) {
    return mongoose.model('Charge').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Charge/template", function(req, res) {
    res.json(new Charge());
});
self.app.post("/entities/Charge/instances", function(req, res) {
    var instanceData = req.body;
    var newCharge = new Charge();
    for (var p in instanceData) {
        newCharge[p] = instanceData[p]; 
    }
    newCharge.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
