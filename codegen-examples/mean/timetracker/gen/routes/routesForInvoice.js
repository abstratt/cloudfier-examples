self.app.get("/entities/Invoice", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Invoice/instances')
    });
});
self.app.get("/entities/Invoice/instances", function(req, res) {
    return mongoose.model('Invoice').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Invoice/template", function(req, res) {
    res.json(new Invoice());
});
self.app.post("/entities/Invoice/instances", function(req, res) {
    var instanceData = req.body;
    var newInvoice = new Invoice();
    for (var p in instanceData) {
        newInvoice[p] = instanceData[p]; 
    }
    newInvoice.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
