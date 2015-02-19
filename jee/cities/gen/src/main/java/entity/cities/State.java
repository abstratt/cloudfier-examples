package entity.cities;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class State {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    public String abbreviation;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<City> cities;
}
