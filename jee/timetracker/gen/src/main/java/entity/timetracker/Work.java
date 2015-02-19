package entity.timetracker;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Work {

    /*************************** ATTRIBUTES ***************************/
    
    public Long units;
    public Date date;
    public String memo;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Task task;
    public Invoice invoice;
}
