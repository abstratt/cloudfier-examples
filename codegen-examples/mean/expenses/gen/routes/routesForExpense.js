self.app.get("/entities/Expense", function(req, res) {
    res.json({
        extentUri: self.resolveUrl('/entities/Expense/instances')
    });
});
self.app.get("/entities/Expense/instances", function(req, res) {
    return mongoose.model('Expense').find().then(function(block) {
        res.json({
            offset: 0,
            length: block.size(),
            contents: block
        });
    });
});
self.app.get("/entities/Expense/template", function(req, res) {
    res.json(new Expense());
});
self.app.post("/entities/Expense/instances", function(req, res) {
    var instanceData = req.body;
    var newExpense = new Expense();
    for (var p in instanceData) {
        newExpense[p] = instanceData[p]; 
    }
    newExpense.save(function(err, created) {
        if (err) {
            respondWithError(req, err);
        } else {
            res.json(created);    
        }
    });
});
