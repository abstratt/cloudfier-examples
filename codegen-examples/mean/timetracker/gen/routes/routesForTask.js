self.app.get("/entities/Task", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Task/instances')
    });
});
self.app.get("/entities/Task/instances", function(req, res) {
    return mongoose.model('Task').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Task/template", function(req, res) {
    res.json(new Task());
});
self.app.post("/entities/Task/instances", function(req, res) {
    var instanceData = req.body;
    var newTask = new Task();
    for (var p in instanceData) {
        newTask[p] = instanceData[p]; 
    }
    newTask.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
