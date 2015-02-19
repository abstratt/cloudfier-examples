package entity.timetracker;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Invoice {

    /*************************** ATTRIBUTES ***************************/
    
    public Date issueDate;
    public String status;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Client client;
    private Collection<Work> reported;
}
