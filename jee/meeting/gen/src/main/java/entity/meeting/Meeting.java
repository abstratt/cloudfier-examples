package entity.meeting;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Meeting {

    /*************************** ATTRIBUTES ***************************/
    
    public String title;
    public String description;
    public Date date;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public User organizer;
    private Collection<User> participants;
}
