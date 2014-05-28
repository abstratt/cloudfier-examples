
Custom UI for the Cloudfier-based ShipIt app
================================================================================

This is an AngularJS UI backed by a Cloudfier-based application back-end. You can see it live at:

http://cloudfier-tracker.orionhub.org:8080/index.html

Things to keep in mind when writing custom UIs for Cloudfier-based apps
--------------------------------------------------------------------------------

- To avoid same-origin policy issues. wherever you host the client files, you will need to set up a reverse proxy for these two paths:
   - "/services/api/" to "http://develop.cloudfier.com/services/proxy-api/"
   - "/services/" to "http://develop.cloudfier.com/services/"

- Your application needs to hit your Cloudfier application API at /services/api/<app-slug>/

- The client code relies on the generic login UI that is automatically generated for all Cloudfier apps
   - The path to the login screen is /services/ui/<app-slug>/root/source
   - Pass in a source query parameter so it will redirect back to your app once log-in completes
   - If your application requires onboarding (profile creation), you need to provide a UI for that. This example currently doesn't provide custom UI for joining the app, so for now you will need to create a profile in the standard generated UI at:
   
   http://develop.cloudfier.com/services/ui/demo-cloudfier-examples-shipit-plus/ (or your application slug)
   
   before you can perform any non-read-only actions.
   

Status
--------------------------------------------------------------------------------

- 2013-10-02 - added license; upgraded bootstrap; added link to the Simple UI for the shipit-plus app; added link to project page on bitbucket
- 2013-04-22 - varios minor UI tweaks, showing indication whether user has joined/is allowed to perform actions (instead of failing silently)
- 2013-03-16 - issue reporting, styling
- 2013-03-15 - UI for checking an issue's details, including comments
- 2013-03-13 - login/logout piggybacking on auto-generated UI
- 2013-03-08 - listing of all issues
- 2013-03-07 - project started