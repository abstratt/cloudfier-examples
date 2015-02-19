package entity.carserv;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Car {

    /*************************** ATTRIBUTES ***************************/
    
    public String registrationNumber;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Model model;
    public Customer owner;
    private Collection<Service> services;
}
