package entity.timetracker;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Task {

    /*************************** ATTRIBUTES ***************************/
    
    public String description;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Work> reported;
    public Client client;
}
