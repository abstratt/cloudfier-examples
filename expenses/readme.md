Expenses
--------------------------------------------------------------------------------

An employee reports expenses. Expenses occur on a date and belong to some 
expense category. Expenses have a memo field describing the specific expense. 
Expenses are initially just recorded as a draft, and must be explicitly submitted. 
Once submitted, an expense can be approved (manually or automatically if under a threshold), 
rejected, or sent back to draft mode for review and later be resubmitted. 

It must be possible to find:

* all expenses submitted, approved and rejected for an employee.
* all expenses for a category
* all expenses for a given period

### Live app

http://develop.cloudfier.com/kirra-api/kirra-ng/?app-path=/services/api-v2/test-cloudfier-examples-expenses/ (UI)

http://develop.cloudfier.com/services/api-v2/test-cloudfier-examples-expenses/ (REST API)

### Live Diagrams

#### Class diagram

![Class diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-expenses/package/expenses.uml?showClassifierCompartments=Always&showStaticFeatures=true&showClasses=true&showAssociationEndName=true&showAttributes=true&showOperations=true&showComments=true&showParameters=true&showAssociationEndMultiplicity=true&showMinimumVisibility=Public&showFeatureVisibility=false&showParameterNames=false&showDerivedElements=false)

#### Statechart diagram

![Statechart diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-expenses/package/expenses.uml?showStateMachines=true)

### Integration with external systems

This application includes an integration with an external system that records approved expenses.

* external system [database](https://docs.google.com/spreadsheet/ccc?key=0ApWq_saU5c8DdENHN0FlSGl4Tm9rdVhpVFlRcE9hVEE) (a Google sheet)
* external system [code](https://script.google.com/d/1Rxmsbr6wvdRIksSO1JIu6LSVHmG5lN5SxYOCapvgcLUB6w1i6vqHsuiv/edit)  (a Google App script, login required)

### Generated code

* Java
  * [Domain/Persistence](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE-expenses/lastSuccessfulBuild/artifact/jee/expenses/gen/src/main/java/expenses/)
  * [REST API](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE-expenses/lastSuccessfulBuild/artifact/jee/expenses/gen/src/main/java/resource/expenses/)

