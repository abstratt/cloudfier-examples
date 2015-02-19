package entity.taxi_fleet;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 *  The vehicles that make up the fleet. 
 */
@Entity
public class Taxi {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Shift shift;
    private Collection<Driver> drivers;
}
