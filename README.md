codegen-examples
================


JEE: [![Build Status](https://textuml.ci.cloudbees.com/buildStatus/icon?job=codegen-examples-JEE)](https://textuml.ci.cloudbees.com/job/codegen-examples-JEE/)

JSE: [![Build Status](https://textuml.ci.cloudbees.com/buildStatus/icon?job=codegen-examples-JSE)](https://textuml.ci.cloudbees.com/job/codegen-examples-JSE/)

MEAN: [![Build Status](https://textuml.ci.cloudbees.com/buildStatus/icon?job=codegen-examples-MEAN)](https://textuml.ci.cloudbees.com/job/codegen-examples-MEAN/)


This project allows generating code (and running tests) from example applications deployed to the Cloudfier server.

In order to try it on your own machine (for the JEE target platform):

```
git clone https://github.com/abstratt/codegen-examples.git
cd codegen-examples
./gen.sh jee car-rental
./test.sh jee car-rental
```

which will generate the car-rental example application as currently deployed by the 'test' Cloudfier user (the default user).

If you want to run it against your own application deployed on Cloudfier:

    ./gen.sh jee <your-app> <your-cloudfier-user> <your-app-base-path>
    ./test.sh jee <your-app>
    
For instance (for a Cloudfier user named 'johndoe', an application named 'crm', stored in the user's Cloudfier workspace under the directory 'my-projects'):

    ./gen.sh jee crm johndoe my-projects
    ./test.sh jee crm

Note this requires your Cloudfier application not to be directly under the root path, but at least a level below (such as my-projects/crm in the case above).
