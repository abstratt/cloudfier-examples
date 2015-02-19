package entity.taxi_fleet;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 *  Drivers that can book taxis. 
 */
@Entity
public class Driver {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Taxi taxi;
    private Collection<Charge> charges;
}
