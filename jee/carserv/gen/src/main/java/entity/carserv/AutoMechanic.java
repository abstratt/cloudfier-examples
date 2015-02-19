package entity.carserv;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class AutoMechanic {

    /*************************** ATTRIBUTES ***************************/
    
    public String firstName;
    public String lastName;
    public String email;
    public String status;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Service> services;
}
