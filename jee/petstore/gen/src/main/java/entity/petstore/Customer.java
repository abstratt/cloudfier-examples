package entity.petstore;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Customer {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Order> orders;
}
