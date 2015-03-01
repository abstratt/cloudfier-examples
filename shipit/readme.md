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

#### Email notifications

This application has the ability of sending email notifications 
when issues are reported, commented on or resolved. In order to
do that, this application includes an integration with an external service 
that can send email notications:

* external service [code](https://script.google.com/d/1d54TavITWQNgGjgsF8CA_KboYe1ySszVSt_tpPHSpGDrsg7BJ9lsCJGM/edit?usp=sharing>)  (Google login required)
