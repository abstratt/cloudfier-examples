package entity.petstore;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Order {

    /*************************** ATTRIBUTES ***************************/
    
    public Date orderDate;
    public String orderStatus;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Customer customer;
}
