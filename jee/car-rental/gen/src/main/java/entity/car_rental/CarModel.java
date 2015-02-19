package entity.car_rental;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class CarModel {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Make make;
}
