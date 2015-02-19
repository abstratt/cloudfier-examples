package entity.taxi_fleet;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 *  Shift modalities. 
 */
@Entity
public class Shift {

    /*************************** ATTRIBUTES ***************************/
    
    public String description;
    public Double price;
    public Long shiftsPerDay;
    
}
