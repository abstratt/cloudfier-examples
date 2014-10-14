rm -Rf $1/$2/gen
wget http://localhost/services/generator/demo-cloudfier-examples-$2/platform/$1 -o /dev/null -O generated.zip
unzip -d $1/$2/gen generated.zip
rm generated.zip
ln -s ../../../node_modules $1/$2/gen/	
