package entity.carserv;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Make {

    /*************************** ATTRIBUTES ***************************/
    
    public String name;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Model> models;
}
