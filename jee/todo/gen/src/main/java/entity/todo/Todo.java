package entity.todo;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Todo {

    /*************************** ATTRIBUTES ***************************/
    
    public String description;
    public String details;
    public String status;
    public Date openedOn;
    public Date completedOn;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public User assignee;
    public User creator;
}
