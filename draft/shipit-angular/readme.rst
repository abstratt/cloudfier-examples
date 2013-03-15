================================================================================
Custom UI for the Cloudfier-based ShipIt app
================================================================================

This is an AngularJS UI backed by a Cloudfier-based application back-end. You can see it live at:

http://cloudfier-tracker.orionhub.org:8080/index.html

Log in using "fsilveira" or "ssimon" as users, really any user you can see in the sample data set:

https://bitbucket.org/abstratt/cloudfier-examples/src/master/shipit/data.json

Things to keep in mind when writing custom UIs for Cloudfier-based apps
--------------------------------------------------------------------------------

- To avoid same-origin policy issues. wherever you host the client files, you will need to set up a reverse proxy for these two paths:
   - "/services/api/" to "http://develop.cloudfier.com/services/proxy-api/"
   - "/services/" to "http://develop.cloudfier.com/services/"
- Your application needs to hit your Cloudfier application API at /services/api/<app-slug>/
- The client code relies on the generic login UI that is automatically generated for all Cloudfier apps
   - The path to the login screen is /services/ui/<app-slug>/root/source
   - Pass in a source query parameter so it will redirect back to your app once log-in completes

Status
--------------------------------------------------------------------------------

- 2013-03-15 - UI for checking an issue's details, including comments
- 2013-03-13 - login/logout piggybacking on auto-generated UI
- 2013-03-08 - listing of all issues
- 2013-03-07 - project started