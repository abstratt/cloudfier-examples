package entity.meeting;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Presentation {

    /*************************** ATTRIBUTES ***************************/
    
    public String title;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public User author;
    public Meeting meeting;
}
