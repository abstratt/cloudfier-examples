package entity.meeting;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class User {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    public String email;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Meeting> meetings;
}
