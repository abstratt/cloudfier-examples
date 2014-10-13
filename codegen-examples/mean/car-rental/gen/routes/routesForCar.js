self.app.get("/entities/Car", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Car/instances')
    });
});
self.app.get("/entities/Car/instances", function(req, res) {
    return mongoose.model('Car').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Car/template", function(req, res) {
    res.json(new Car());
});
self.app.post("/entities/Car/instances", function(req, res) {
    var instanceData = req.body;
    var newCar = new Car();
    for (var p in instanceData) {
        newCar[p] = instanceData[p]; 
    }
    newCar.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
