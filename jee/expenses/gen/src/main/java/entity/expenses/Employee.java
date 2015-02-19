package entity.expenses;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 *  An employee reports expenses. 
 */
@Entity
public class Employee {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    public String username;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Expense> expenses;
}
