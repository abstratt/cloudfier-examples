Expenses
--------------------------------------------------------------------------------

An employee reports expenses. Expenses occur on a date and belong to some 
expense category. Expenses have a memo field describing the specific expense. 
Expenses are initially just recorded, and must be explicitly submitted. 
Once submitted, an expense can be approved, denied, or sent back for review 
and later be resubmitted. One must be able to find:

* all expenses submitted, approved and rejected for an employee.
* all expenses for a category
* all expenses for a given period

### Diagrams

#### Class diagram

![Class diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-expenses/package/expenses.uml?showClasses=true&showAttributes=true)

#### Statechart diagram

![Statechart diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-expenses/package/expenses.uml?showStateMachines=true)

### Integration with external systems

This application includes an integration with an external system that records approved expenses.

* external system [database](https://docs.google.com/spreadsheet/ccc?key=0ApWq_saU5c8DdENHN0FlSGl4Tm9rdVhpVFlRcE9hVEE) (a Google sheet)
* external system [code](https://script.google.com/d/1Rxmsbr6wvdRIksSO1JIu6LSVHmG5lN5SxYOCapvgcLUB6w1i6vqHsuiv/edit)  (a Google App script, login required)
