package entity.petstore;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Product {

    /*************************** ATTRIBUTES ***************************/
    
    public String productName;
    public Double productPrice;
    public Double unitCost;
    public String productDescription;
    public Double productWeight;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Category category;
}
