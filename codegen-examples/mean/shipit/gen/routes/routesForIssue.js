self.app.get("/entities/Issue", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Issue/instances')
    });
});
self.app.get("/entities/Issue/instances", function(req, res) {
    return mongoose.model('Issue').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Issue/template", function(req, res) {
    res.json(new Issue());
});
self.app.post("/entities/Issue/instances", function(req, res) {
    var instanceData = req.body;
    var newIssue = new Issue();
    for (var p in instanceData) {
        newIssue[p] = instanceData[p]; 
    }
    newIssue.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
