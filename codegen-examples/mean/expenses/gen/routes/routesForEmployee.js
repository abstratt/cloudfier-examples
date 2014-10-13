self.app.get("/entities/Employee", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Employee/instances')
    });
});
self.app.get("/entities/Employee/instances", function(req, res) {
    return mongoose.model('Employee').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Employee/template", function(req, res) {
    res.json(new Employee());
});
self.app.post("/entities/Employee/instances", function(req, res) {
    var instanceData = req.body;
    var newEmployee = new Employee();
    for (var p in instanceData) {
        newEmployee[p] = instanceData[p]; 
    }
    newEmployee.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
