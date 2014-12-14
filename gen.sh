rm -Rf $1/$2/gen
mkdir -p $1/$2/gen
wget -v -d  http://develop.cloudfier.com/services/generator/test-cloudfier-examples-$2/platform/$1  -O generated.zip
unzip -d $1/$2/gen generated.zip
rm -Rf generated.zip
ln -s ../../../node_modules $1/$2/gen/	

