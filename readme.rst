================================================================================
Example Cloudfier apps
================================================================================

This repository contains simple examples of Cloudfier applications.

For instructions on how to get these example apps into Cloudfier, 
`read this <http://cloudfier.com/doc/creating/examples/>`_.

When running these applications, it is usually possible to login as user 'guest' 
(no password), except if the application does not support anonymous login (check 
the mdd.properties file). The descriptions below include some examples of credentials
that can be used to log in.


Expenses
--------------------------------------------------------------------------------

An employee reports expenses. Expenses occur on a date and belong to some 
expense category. Expenses have a memo field describing the specific expense. 
Expenses are initially just recorded, and must be explicitly submitted. 
Once submitted, an expense can be approved, denied, or sent back for review 
and later be resubmitted. One must be able to find:

* all expenses submitted, approved and rejected for an employee.
* all expenses for a category
* all expenses for a given period

This application includes an integration with an external system that records approved expenses.

* external system `code <https://script.google.com/d/1Rxmsbr6wvdRIksSO1JIu6LSVHmG5lN5SxYOCapvgcLUB6w1i6vqHsuiv/edit>`_
* external system `database <https://docs.google.com/spreadsheet/ccc?key=0ApWq_saU5c8DdENHN0FlSGl4Tm9rdVhpVFlRcE9hVEE>`

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
`Domain-Driven Design Using Naked Objects <http://pragprog.com/book/dhnako/domain-driven-design-using-naked-objects>`_ by Dan Haywood.
