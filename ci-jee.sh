CWD=$WORKSPACE
: ${CWD:=$PWD}

for app_path in jee/* ; do
	app=${app_path##*/}
	echo "Running tests for - $app"
	./gen.sh jee $app
	./test.sh jee $app "-DreportsDirectory=$CWD/test-reports"
done

