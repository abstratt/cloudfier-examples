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

Examples of user names (no password required):

User: "john ford"
User: guest

ShipIt
--------------------------------------------------------------------------------

Users can be either committers or reporters. Anyone can report and comment on issues. 
Committers can take over issues, resolve, assign them to other committers.

Examples of user names (no password required):

User: "ssimon" (a committer)
User: "fsilveira" (a user)

PetStore
--------------------------------------------------------------------------------

The traditional Pet Store application.

User: guest

CarServ
--------------------------------------------------------------------------------

Application reverse engineered from the CarServ sample application that appears in the book 
`Domain-Driven Design Using Naked Objects <http://pragprog.com/book/dhnako/domain-driven-design-using-naked-objects>`_ by Dan Haywood.

User: "teresa perkins" (an auto mechanic)
User: "joe bloggs" (a customer)
User: guest