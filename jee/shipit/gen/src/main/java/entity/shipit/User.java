package entity.shipit;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
@Entity
public class User {

    /*************************** ATTRIBUTES ***************************/
    
    public String email;
    public String fullName;
    public String kind;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Issue> issuesReportedByUser;
    private Collection<Issue> voted;
    private Collection<Issue> issuesAssignedToUser;
    private Collection<Issue> issuesWatched;
}
