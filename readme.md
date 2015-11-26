Example Cloudfier apps
================================================================================

This repository contains simple examples of [Cloudfier](http://cloudfier.com) ([git repository](http://github.com/abstratt/cloudfier)) applications.

[![Build Status](https://textuml.ci.cloudbees.com/buildStatus/icon?job=cloudfier-examples-deploy)](https://textuml.ci.cloudbees.com/job/cloudfier-examples-deploy/)


### Loading the examples into Cloudfier

For instructions on how to get these example apps into Cloudfier, 
[read this](http://cloudfier.com/doc/creating/examples/).

When running these applications, it is usually possible to login as user 'guest' 
(no password), except if the application does not support anonymous login (check 
the mdd.properties file). The descriptions below include some examples of credentials
that can be used to log in.

### Loading the examples into the TextUML Toolkit

1. clone the entire repository as a single MDD project in the TextUML Toolkit (you will need Git support in Eclipse)
2. create a second MDD project called kirra
3. add the contents of [kirra.tuml](https://github.com/abstratt/cloudfier/blob/master/kirra-mdd/com.abstratt.kirra.mdd.core/models/kirra.tuml) there

Note that in this setup, all .uml files (the actual UML models) are created at the root, and you can only visualize diagrams by opening the .uml files, not the source.tuml files (which is possible when the source files are side-by-side with the .uml files).


Expenses
--------------------------------------------------------------------------------

See Expenses example application own documentation for more information.

CarRental
--------------------------------------------------------------------------------
Simple app, but shows how to write test suites (run them with run-tests).

ShipIt
--------------------------------------------------------------------------------

Users can be either committers or reporters. Anyone can report and comment on issues. 
Committers can take over issues, resolve, assign them to other committers.

ShipIt Custom UI
--------------------------------------------------------------------------------

A custom UI for the ShipIt application above. Relies on the same back-end (API/business logic/persistence) as the generated UI.

Same users apply.

PetStore
--------------------------------------------------------------------------------

The traditional Pet Store application.

CarServ
--------------------------------------------------------------------------------

Application reverse engineered from the CarServ sample application that appears in the book 
[Domain-Driven Design Using Naked Objects](http://pragprog.com/book/dhnako/domain-driven-design-using-naked-objects) by Dan Haywood.
