self.app.get("/entities/Rental", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Rental/instances')
    });
});
self.app.get("/entities/Rental/instances", function(req, res) {
    return mongoose.model('Rental').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Rental/template", function(req, res) {
    res.json(new Rental());
});
self.app.post("/entities/Rental/instances", function(req, res) {
    var instanceData = req.body;
    var newRental = new Rental();
    for (var p in instanceData) {
        newRental[p] = instanceData[p]; 
    }
    newRental.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
