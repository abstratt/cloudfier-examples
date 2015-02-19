package entity.shipit;

import java.util.*;
import javax.persistence.*;
import javax.ejb.*;
    
/**
 * An issue describes a problem report, a feature request or just a work item for a project. Issues are reported by and
 * assigned to users, and go through a lifecycle from the time they are opened until they are resolved and eventually
 * closed. 
 */
@Entity
public class Issue {

    /*************************** ATTRIBUTES ***************************/
    
    public String summary;
    public Date reportedOn;
    public String severity;
    public String status;
    public String resolution;
    public Date resolvedOn;
    public String description;
    
    /*************************** RELATIONSHIPS ***************************/
    
    private Collection<Label> labels;
    public Project project;
    public User reporter;
    public User assignee;
    private Collection<User> watchers;
    private Collection<User> voters;
}
