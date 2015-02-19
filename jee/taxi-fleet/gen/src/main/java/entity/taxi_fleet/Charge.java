package entity.taxi_fleet;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 *  Charges for renting taxis. 
 */
@Entity
public class Charge {

    /*************************** ATTRIBUTES ***************************/
    
    public Date date;
    public Date receivedOn;
    public String description;
    public Double amount;
    public String status;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Driver driver;
    public Taxi taxi;
}
