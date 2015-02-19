package entity.todo;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class User {

    /*************************** ATTRIBUTES ***************************/
    
    public String email;
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Todo> todos;
}
