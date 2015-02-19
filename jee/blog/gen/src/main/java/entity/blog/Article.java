package entity.blog;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class Article {

    /*************************** ATTRIBUTES ***************************/
    
    public String title;
    public String body;
    public String tags;
    public Date createdAt;
    
    /*************************** RELATIONSHIPS ***************************/
    
    public User user;
}
