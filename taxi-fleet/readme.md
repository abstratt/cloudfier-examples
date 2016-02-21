Taxi Fleet Rental management application
--------------------------------------------------------------------------------

This application manages a fleet of taxis that are rented to drivers.

A taxi is either single or double shift, meaning they are rented exclusively or 
shared between two drivers.

* The application must allow payments to be recorded on behalf of a driver;
* The application must send an email notification when a shift was not paid.
* The application must produce reports on rental performance of taxis

For more details, see [project proposal](https://www.freelancer.com/projects/PHP-MySQL/Simple-payment-entry-software.html).

### Live app

http://develop.cloudfier.com/kirra-api/kirra-ng/?app-path=/services/api-v2/test-cloudfier-examples-taxi-fleet/ (UI)

http://develop.cloudfier.com/services/api-v2/test-cloudfier-examples-taxi-fleet/ (REST API)

### Live Diagrams

#### Class diagram

![Class diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-taxi-fleet/package/taxi_fleet.uml?showClassifierCompartments=Always&showStaticFeatures=true&showClasses=true&showAssociationEndName=true&showAttributes=true&showOperations=true&showComments=true&showParameters=true&showAssociationEndMultiplicity=true&showMinimumVisibility=Public&showFeatureVisibility=false&showParameterNames=false&showDerivedElements=false)

#### Statechart diagram

![Statechart diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-taxi-fleet/package/taxi_fleet.uml?showStateMachines=true)


### Generated code

* Java
  * [Domain/Persistence](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE/ws/jee/taxi-fleet/gen/src/main/java/taxi_fleet/)
  * [REST API](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE/ws/jee/taxi-fleet/gen/src/main/java/resource/taxi_fleet/)
