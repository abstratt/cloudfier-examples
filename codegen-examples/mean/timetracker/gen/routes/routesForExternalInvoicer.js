self.app.get("/entities/ExternalInvoicer", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/ExternalInvoicer/instances')
    });
});
self.app.get("/entities/ExternalInvoicer/instances", function(req, res) {
    return mongoose.model('ExternalInvoicer').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/ExternalInvoicer/template", function(req, res) {
    res.json(new ExternalInvoicer());
});
self.app.post("/entities/ExternalInvoicer/instances", function(req, res) {
    var instanceData = req.body;
    var newExternalInvoicer = new ExternalInvoicer();
    for (var p in instanceData) {
        newExternalInvoicer[p] = instanceData[p]; 
    }
    newExternalInvoicer.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
