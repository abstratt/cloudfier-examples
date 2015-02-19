package entity.timetracker;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Client {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Task> tasks;
    private Collection<Invoice> invoices;
}
