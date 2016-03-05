# Carserv - A management application for an auto repair shop

Model initially reverse engineered from the CarServ 
  sample application that appears in the book
  book [Domain-Driven Design Using Naked Objects](http://pragprog.com/book/dhnako/domain-driven-design-using-naked-objects)
  by Dan Haywood.
  
- can book services on cars
- services can be assigned to auto-mechanics that are working
- services can be transferred between auto-mechanics
- services can be cancelled before started
- auto-mechanics can go on vacation, or retire
- customers with 2 or more cars serviced at the garage are VIP customers

### Live app

http://develop.cloudfier.com/kirra-api/kirra-ng/?app-path=/services/api-v2/test-cloudfier-examples-carserv/ (UI)

http://develop.cloudfier.com/services/api-v2/test-cloudfier-examples-carserv/ (REST API)

### Live Diagrams

#### Class diagram

![Class diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-carserv/package/carserv.uml?showClassifierCompartments=Always&showStaticFeatures=true&showClasses=true&showAssociationEndName=true&showAttributes=true&showOperations=true&showComments=true&showParameters=true&showAssociationEndMultiplicity=true&showMinimumVisibility=Public&showFeatureVisibility=false&showParameterNames=false&showDerivedElements=false)

#### Statechart diagram

![Statechart diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-carserv/package/carserv.uml?showStateMachines=true)

### Generated code

* Java
  * [Domain/Persistence](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE/ws/jee/carserv/gen/src/main/java/carserv/)
  * [REST API](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE/ws/jee/carserv/gen/src/main/java/resource/carserv/)


