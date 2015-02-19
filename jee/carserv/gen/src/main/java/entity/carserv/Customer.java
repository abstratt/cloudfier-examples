package entity.carserv;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Customer {

    /*************************** ATTRIBUTES ***************************/
    
    public String firstName;
    public String lastName;
    public String email;
    public String title;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Car> cars;
}
