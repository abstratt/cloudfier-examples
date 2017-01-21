ShipIt - An issue tracking module
--------------------------------------------------------------------------------

Users can be either committers or reporters. Anyone can report and comment on issues. 
Committers can take over issues, resolve, assign them to other committers.

This is configured as a library project. As such, it cannot be deployed as
an application. The sibling project shipit-plus is a deployable application that 
uses this library project.

This application sends signals to an external user notification 
service when issues are reported, commented on or resolved.

See the sibling project shipit-plus for how those notifications are eventually
sent as email notifications.

### Live app

http://develop.cloudfier.com/kirra-api/kirra-ng/?app-path=/services/api-v2/test-cloudfier-examples-shipit/ (UI)

http://develop.cloudfier.com/services/api-v2/test-cloudfier-examples-shipit/ (REST API)


### Live Diagrams

#### Class diagram

![Class diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-shipit/package/shipit.uml?showClassifierCompartments=Always&showStaticFeatures=true&showClasses=true&showAssociationEndName=false&showAttributes=true&showOperations=true&showComments=true&showParameters=true&showAssociationEndMultiplicity=true&showMinimumVisibility=Public&showFeatureVisibility=false&showParameterNames=false&showDerivedElements=false&showAssociationName=true)

#### Statechart diagram

![Statechart diagram for the application](https://develop.cloudfier.com/services/diagram/test-cloudfier-examples-shipit/package/shipit.uml?showStateMachines=true)


### Integrations

#### Email notifications

This application has the ability of sending email notifications 
when issues are reported, commented on or resolved. In order to
do that, this application includes an integration with an external service 
that can send email notications:

* external service [code](https://script.google.com/d/1d54TavITWQNgGjgsF8CA_KboYe1ySszVSt_tpPHSpGDrsg7BJ9lsCJGM/edit?usp=sharing>)  (Google login required)

### Generated code

* Java
  * [Domain/Persistence](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE-shipit/lastSuccessfulBuild/artifact/jee/shipit/gen/src/main/java/shipit/)
  * [REST API](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE-shipit/lastSuccessfulBuild/artifact/jee/shipit/gen/src/main/java/resource/shipit/)
