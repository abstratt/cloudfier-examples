package entity.expenses;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 *  The expense as reported by an employee. 
 */
@Entity
public class Expense {

    /*************************** ATTRIBUTES ***************************/
    
    public String description;
    public String status;
    public Double amount;
    public Date date;
    public Date processed;
    public String rejectionReason;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Category category;
    public Employee employee;
    public Employee approver;
}
