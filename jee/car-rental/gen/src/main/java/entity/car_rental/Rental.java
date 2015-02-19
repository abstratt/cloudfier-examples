package entity.car_rental;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Rental {

    /*************************** ATTRIBUTES ***************************/
    
    public Date started;
    public Date returned;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Car car;
    public Customer customer;
}
