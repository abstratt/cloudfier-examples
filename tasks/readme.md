## TeamTasks

TeamTasks is an application to manage tasks to be done. This application allows keeping track of individual tasks and the contributors who will be completing said tasks.

### Creating contributors

When you create a new Contributor, you are required to provide the contributor’s name be set. Once created, a contributor may have tasks assigned to them (you’ll see how later).

> Behind the scenes: Contributor is an entity with a required string “name” attribute. It also has a relationship one-to-many with tasks.


### Creating tasks

When you create a new Task or edit an existing one, you are requested to provide a few of pieces of information: the task’s description, an optional assignee (selected among those already created), and some optional details.

> Behind the scenes: 
>

### Task Status

Tasks may be in one of two statuses. A task starts in the “Open” status and eventually (hopefully!) transitions to the “Completed” status. A task transitions between the two statuses as contributors trigger the “Complete” and “Reopen” actions (more on task actions later)

> Behind the scenes: a status machine is used to track the status of tasks. Executing the “complete” action will cause the status to change to Completed, setting the completion date to today's date, just as triggering the Reopen action will erase the completion date and reset the state to Open.
>
>Or in the statechart notation:
>

### Task Actions

There are a few actions you can apply to tasks:


An open task can be marked as completed via the Complete action (conversely, you can reopen a completed task via the Reopen action).

You can also change who the contributor for a task is via the Reassign action (you will be requested to provide a contributor other than the current assignee).

> Behind the scenes: actions are modeled as result-less operations on the related entity.

Actions may specify behavior. Also, actions may declare input parameters. Finally, actions may specify preconditions. The Reassign action illustrates all three features.

### Task Queries

Aside seeing all tasks, you may also filter tasks by selecting a criteria, such as open tasks, open tasks assigned a specific contributor, tasks opened today, tasks opened on a specific date etc. 

> Behind the scenes: we model task queries by declaring static query operations, which traverse the extent of the Task entity, selecting those tasks that satisfy some condition.

