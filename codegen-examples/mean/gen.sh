rm -Rf $1/gen
wget http://localhost/services/generator/demo-cloudfier-examples-$1/platform/$2 -o /dev/null -O generated.zip
unzip -d $1/gen generated.zip
rm generated.zip

