================================================================================
Custom UI for the Cloudfier-based ShipIt app
================================================================================

This is an AngularJS UI backed by a Cloudfier-based application back-end. You can see it live at:

http://cloudfier-tracker.orionhub.org:8080/index.html

Log in using "fsilveira" or "ssimon" as users, really any user you can see in the sample data set:

https://bitbucket.org/abstratt/cloudfier-examples/src/master/shipit/data.json

Things to keep in mind when writing custom UIs for Cloudfier-based apps
--------------------------------------------------------------------------------

* Wherever you host the client files, you will need to proxy the "/services/" URI path to "http://develop.cloudfier.com/services/"
* The client code relies on the generic login UI that is automatically generated for all Cloudfier apps.

Status
--------------------------------------------------------------------------------

2013-03-07 - project started

2013-03-08 - listing of all issues

2013-03-13 - login/logout piggybacking on auto-generated UI

