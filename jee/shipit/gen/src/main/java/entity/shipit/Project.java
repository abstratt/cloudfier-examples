package entity.shipit;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 *  Issues are reported against a specific project. 
 */
@Entity
public class Project {

    /*************************** ATTRIBUTES ***************************/
    
    public String description;
    public String token;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Issue> issues;
}
