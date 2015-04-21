//1.Set up a Leaflet map on a web page,center the map on Kathmandu at a suitable zoom level,
//2.Add a geojson layer for Schools in Kathmandu using data from OpenStreetMap.
//3.color the polygons thus drawn using these colors for School's level:
	//kindergarten --> yellow
	//primary --> orange
	//lower secondary --> green
	//higher secondary --> blue

//------------------------------------------------------------------Step 1--------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------

//initialize variables
	var map, osmTiles, vectorsFromGeojson;

//now lets initialize the map
	map = L.map("map");

//initialize the tile layer (basemap layer)
osmTiles = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"><br/>courtesy of <a href="https://rajanmaharjan.wordpress.com/">Rajan Maharjan</a>'
});

//npw that the map variable knows it's a map, the tile variable knows its a base layer, lets add the base layer to the map
	map.addLayer(osmTiles);

//now we want to set the map view to Baneshwor at such a zoom level that streets can be clearly seen..
	map.setView([27.70773,85.31485], 15);

//------------------------------------------------------------------Step 2--------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------


//lets create a function that draws the vector layers on the map

	function drawVectorLayer	(data){
		vectorsFromGeojson = L.geoJson(data);
		map.addLayer(vectorsFromGeojson);
	}

//now that we know what we'r gonna do with the geojson data once it arrives (ie, our drawVectorLayer function will draw the features from the geojson data on our map), we can ask jquery to fetch the json for us, and pass it as parameter (ie "data") to our drawVectorLayer function..

	jQuery.getJSON("data.geojson", drawVectorLayer);


//------------------------------------------------------------------Step 3--------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------

//------Adding Interaction

//define an event listener for layer mouseover event:
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: getColor,
		dashArray: '',
		fillOpacity:0.4

	});


	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

}


//----define what happens on mouseout:
function resetHighlight(e) {
	vectorsFromGeojson.resetStyle(e.target);
	info.update();
}

//--------reset the layer style to its default state
vectorsFromGeojson = L.geoJson(data);

//-----define a click listener that zooms to the state:
function zoomToFeature(e) {
	//map.fitBounds(e.target);
	}



//-------onEachFeature option to add the listeners on our state layers:
function onEachFeaturedetails(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature

	});
	//bind a popup with feature's geojson notation as its content..the popup opens up when user clicks on the feature..
	layer.bindPopup("School Name : "+feature.properties.name+"<br/>"
		+"Operator Type : "+feature.properties["operator:type"]+"<br/>"
		+"Isced Level : "+feature.properties["isced:level"]+" "+feature.properties.amenity+"<br/>"
		+feature.properties["student:count"]+" students studied here in 2013"+"<br/>"
		+"Source of Information : "+feature.properties.source);

}

function getColor(feature) {
    switch (feature.properties["isced:level"]) {
        case 'kindergarten': return {color: "yellow"};
        case 'primary':   return {color: "orange"};
        case 'secondary': return {color: "red"};
        case 'lower_secondary':   return {color: "green"};
        case 'higher_secondary': return {color: "blue"};
        default : return {color: "black"};
    }
}

//draw vector data
function drawVectorLayer(data){

//we have our geojson layer ready, but wait..we need to add it to the map to be able to see it..
		vectorsFromGeojson = L.geoJson(data,{
				style: getColor,onEachFeature: onEachFeaturedetails
				});
	 map.addLayer(vectorsFromGeojson);
 }

//------------------------------------------------------------------------------------------------------------------------------------
