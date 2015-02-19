package entity.cities;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class City {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    public Long population;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public State cityState;
}
