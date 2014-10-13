self.app.get("/entities/Comment", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Comment/instances')
    });
});
self.app.get("/entities/Comment/instances", function(req, res) {
    return mongoose.model('Comment').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Comment/template", function(req, res) {
    res.json(new Comment());
});
self.app.post("/entities/Comment/instances", function(req, res) {
    var instanceData = req.body;
    var newComment = new Comment();
    for (var p in instanceData) {
        newComment[p] = instanceData[p]; 
    }
    newComment.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
