codegen-examples
================


[![Build Status](https://textuml.ci.cloudbees.com/buildStatus/icon?job=codegen-examples)](https://textuml.ci.cloudbees.com/job/codegen-examples/)

This project allows generating code (and running tests) from example applications deployed to the Cloudfier server.

In order to try it on your own machine:

```
git clone https://github.com/abstratt/codegen-examples.git
cd codegen-examples
./ci.sh mean car-rental
```

which will generate the car-rental example application as deployed by the 'test' Cloudfier user (the default user).

If you want to run it against your own application deployed on Cloudfier:

    ./gen.sh mean <your-app> <your-cloudfier-user> <your-app-base-path>
    ./test.sh mean <your-app>
    
For instance:

    ./gen.sh mean crm johndoe my-projects
    ./test.sh mean crm

Note this requires your Cloudfier application not to be directly under the root path, but at least a level below (such as my-projects/my-app-dir).
