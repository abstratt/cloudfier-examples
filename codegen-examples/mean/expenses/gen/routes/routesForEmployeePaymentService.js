self.app.get("/entities/EmployeePaymentService", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/EmployeePaymentService/instances')
    });
});
self.app.get("/entities/EmployeePaymentService/instances", function(req, res) {
    return mongoose.model('EmployeePaymentService').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/EmployeePaymentService/template", function(req, res) {
    res.json(new EmployeePaymentService());
});
self.app.post("/entities/EmployeePaymentService/instances", function(req, res) {
    var instanceData = req.body;
    var newEmployeePaymentService = new EmployeePaymentService();
    for (var p in instanceData) {
        newEmployeePaymentService[p] = instanceData[p]; 
    }
    newEmployeePaymentService.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
