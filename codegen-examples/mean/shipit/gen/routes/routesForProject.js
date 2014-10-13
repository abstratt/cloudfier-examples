self.app.get("/entities/Project", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Project/instances')
    });
});
self.app.get("/entities/Project/instances", function(req, res) {
    return mongoose.model('Project').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Project/template", function(req, res) {
    res.json(new Project());
});
self.app.post("/entities/Project/instances", function(req, res) {
    var instanceData = req.body;
    var newProject = new Project();
    for (var p in instanceData) {
        newProject[p] = instanceData[p]; 
    }
    newProject.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
