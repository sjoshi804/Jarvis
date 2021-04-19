# Productivity App

## Endpoints 

### Task
| Type | Endpoint | Description (optional)
|-------------------|------------------------------------------------------|-------------------------------|
| POST              | /productivity/task/                                  | Create new task               |
| GET/UPDATE/DELETE | /productivity/task/:task_id                          | RUD for a particular task     |
| GET               | /productivity/task/pending                           | Get all pending tasks         |


### Goal 
| Type | Endpoint | Description (optional)
|-------------------|------------------------------------------------------|-------------------------------|
| POST              | /productivity/goal/                                  | Create new goal               |
| GET/UPDATE/DELETE | /productivity/goal/:goal_id                          | RUD for a particular goal     |
| GET               | /productivity/goal                                   | Get all goals                 |

### Project
| Type | Endpoint | Description (optional)
|-------------------|------------------------------------------------------|-------------------------------|
| POST              | /productivity/project/                               | Create new project            |
| GET/UPDATE/DELETE | /productivity/project/:project_id                    | RUD for a particular project  |
| GET               | /productivity/project/pending                        | Get all pending projects      |

### Daily Plan
| Type | Endpoint | Description (optional)
|-------------------|------------------------------------------------------|--------------------------------------|
| POST              | /productivity/daily_plan/                            | Create new daily_plan                | 
| POST              | /productivity/daily_plan/add_task/:task_id           | Add task by id to current daily plan |
| GET               | /productivity/daily_plan                             | Get today's plan                     |
| POST              | /productivity/daily_plan/review                      | Review yesterday's plan              | 

### Sprint
| Type | Endpoint | Description (optional)
|-------------------|------------------------------------------------------|----------------------------------|
| POST              | /productivity/sprint/                                | Create new sprint                |
| POST              | /productivity/sprint/add_task/:task_id               | Add task by id to current sprint |
| GET               | /productivity/sprint                                 | Get current sprint               |