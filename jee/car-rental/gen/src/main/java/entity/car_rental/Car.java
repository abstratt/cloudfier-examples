package entity.car_rental;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Car {

    /*************************** ATTRIBUTES ***************************/
    
    public String plate;
    public Double price;
    public Long year;
    public String color;
    public String status;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public CarModel model;
    private Collection<Rental> rentals;
}
