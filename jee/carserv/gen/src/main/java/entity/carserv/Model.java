package entity.carserv;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Model {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public Make make;
}
