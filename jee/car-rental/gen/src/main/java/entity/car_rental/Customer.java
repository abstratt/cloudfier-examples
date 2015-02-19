package entity.car_rental;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Customer {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Rental> rentals;
}
