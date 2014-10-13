self.app.get("/entities/Category", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Category/instances')
    });
});
self.app.get("/entities/Category/instances", function(req, res) {
    return mongoose.model('Category').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Category/template", function(req, res) {
    res.json(new Category());
});
self.app.post("/entities/Category/instances", function(req, res) {
    var instanceData = req.body;
    var newCategory = new Category();
    for (var p in instanceData) {
        newCategory[p] = instanceData[p]; 
    }
    newCategory.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
