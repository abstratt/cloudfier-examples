package entity.carserv;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Service {

    /*************************** ATTRIBUTES ***************************/
    
    public String description;
    public Date bookedOn;
    public Date estimatedReady;
    public String status;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Car car;
    public AutoMechanic technician;
}
