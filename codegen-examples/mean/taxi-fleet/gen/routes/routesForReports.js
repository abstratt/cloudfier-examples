self.app.get("/entities/Reports", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Reports/instances')
    });
});
self.app.get("/entities/Reports/instances", function(req, res) {
    return mongoose.model('Reports').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Reports/template", function(req, res) {
    res.json(new Reports());
});
self.app.post("/entities/Reports/instances", function(req, res) {
    var instanceData = req.body;
    var newReports = new Reports();
    for (var p in instanceData) {
        newReports[p] = instanceData[p]; 
    }
    newReports.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
