Example Cloudfier apps
================================================================================

This repository contains simple examples of Cloudfier applications.

### Loading the examples into Cloudfier

For instructions on how to get these example apps into [Cloudfier](http://cloudfier.com), 
[read this](http://cloudfier.com/doc/creating/examples/).

When running these applications, it is usually possible to login as user 'guest' 
(no password), except if the application does not support anonymous login (check 
the mdd.properties file). The descriptions below include some examples of credentials
that can be used to log in.

### Taking the examples through the JavaEE generator

You can play with the JavaEE-based code generation on your own machine.

#### Prerequisites

* an internet connection
* git
* Java 1.8
* Maven 3.0.x
* Postgres 9.x

#### Steps

##### 1 Clone the examples repo

```
  git clone https://github.com/abstratt/cloudfier-examples.git
```

##### 2 Run the generator

```
# change into any of the application directories
cd cloudfier-examples/expenses

# push the application to a temp repository on develop.cloudfier.com and generate the code
mvn com.abstratt:cloudfier-maven-plugin:publish \
    com.abstratt:cloudfier-maven-plugin:generate \
    -Dkirra.target.platform=jee \
    -Dkirra.project.sourcedir=. \
    -Dkirra.generator.override=true
```
At the end of this step, you will find a fully functioning JavaEE app in the current directory.

##### 3 Compile the generated code

```
mvn clean install -DskipTests
```

##### 4 Run the tests (optional)

```
mvn test
```

##### 5 Run the application

```
mvn exec:java -Dexec.arguments=initData,run  -Dhttp.port=8888 -Dexec.classpathScope=test
```

The application REST API will be available at: http://localhost:8888/

If you would rather play through a (generic) UI, you can use this URL instead:

http://develop.cloudfier.com/kirra-api/kirra-ng/?app-uri=http://localhost:8888


### Loading the examples into the TextUML Toolkit

If you are a TextUML Toolkit user, you can load these examples into the TextUML Toolkit as well.

1. clone the entire repository as a single MDD project in the TextUML Toolkit (you will need Git support in Eclipse)
2. create a second MDD project called kirra
3. add the contents of [kirra.tuml](https://github.com/abstratt/cloudfier/blob/master/kirra-mdd/com.abstratt.kirra.mdd.core/models/kirra.tuml) there

Note that in this setup, all .uml files (the actual UML models) are created at the root, and you can only visualize diagrams (if you are into that sort of stuff) by opening the .uml files, not the source.tuml files (which is possible when the source files are side-by-side with the .uml files).

