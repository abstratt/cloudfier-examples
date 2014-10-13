self.app.get("/entities/Customer", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Customer/instances')
    });
});
self.app.get("/entities/Customer/instances", function(req, res) {
    return mongoose.model('Customer').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Customer/template", function(req, res) {
    res.json(new Customer());
});
self.app.post("/entities/Customer/instances", function(req, res) {
    var instanceData = req.body;
    var newCustomer = new Customer();
    for (var p in instanceData) {
        newCustomer[p] = instanceData[p]; 
    }
    newCustomer.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
