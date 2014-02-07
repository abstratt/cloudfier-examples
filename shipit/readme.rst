ShipIt - A issue tracking module
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