package entity.shipit;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Label {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Issue> labeled;
}
