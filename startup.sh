echo "Starting services...."

echo "starting backend server"
gnome-terminal -- java -jar ~/Desktop/usedtooling/web/target/web-0.0.1-SNAPSHOT.jar
echo "backend server started successfully"

#echo "starting frontend server"
#gnome-terminal -- serve -s ~/Desktop/usedtooling/frontEnd/usedtooling/build
#echo "frontend server started successfully"

echo "starting daily product grabber"
gnome-terminal -- java -jar ~/Desktop/usedtooling/complete/target/ProductScraper-0.0.1-SNAPSHOT.jar
echo "daily product grabber started successfully"

echo "started detail grabber"
gnome-terminal -- java -jar ~/Desktop/usedtooling/testScrape/target/testScrape-1.0-SNAPSHOT.jar
echo "detail graber started successfully"

echo "Services started successfully."

gnome-system-monitor

