// Visualising

// 1. Set up satellite map
Map.setOptions('SATELLITE')
Map.setCenter(174.0638,-39.2891,9) //see in Docs (lon,lat,zoom)

// Viz an image
var srtm = ee.Image("CGIAR/SRTM90_V4")
print(srtm)
Map.addLayer(srtm, {
  palette: ['black','blue', 'lime','orange', 'yellow'],
  min: 0,
  max: 2500
}, 'srtm');
//can use inspector to look at value at specific point
//can add arguments to change color palette

//Visualize a Feature Collection
var wdpa = ee.FeatureCollection("WCMC/WDPA/current/polygons")
Map.addLayer(wdpa,{color:'yellow'},'wdpa')

// no of PAs
var no_pas = wdpa.size()
print('Number of PAs:',no_pas)

// sort filter
//var first_pa = wdpa.sort('STATUS_YR',false).first()
//print ('First PA:',first_pa)

//filter only category II
var national_parks = wdpa.filter(ee.Filter.eq('IUCN_CAT', 'II'));
print('National parks size:', national_parks.size());
Map.addLayer(national_parks, {color: 'lime'}, 'national parks');

var countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017");
print ('countries',countries);
Map.addLayer(countries)

//Filter only NZ
var nz = countries.filter(ee.Filter.eq('country_co', 'NZ')); //filter to NZ
Map.addLayer(nz, {color: 'white'}, 'nz'); //add to map

//Quantify number of PAs in NZ
var nz_pas = wdpa.filter(ee.Filter.bounds(nz));
print('No. of pas in NZ:', nz_pas.size());
Map.addLayer(nz_pas, {color: 'pink'}, 'nz_pas');

var national_parks_nz = nz_pas.filter(ee.Filter.eq('IUCN_CAT', 'II'));
print('New Zealand no. of PAs:', national_parks_nz.size());
Map.addLayer(national_parks_nz, {color: 'indigo'}, 'nz national parks'); //18 national parks

//making workflow efficient compare with the one above
var nz1 = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017") // Import countries
    .filter(ee.Filter.eq('country_co','NZ')) // filter new zealand from country_co
    
var nz_nps1 = ee.FeatureCollection("WCMC/WDPA/current/polygons") //load protected areas
        .filter(ee.Filter.eq('IUCN_CAT', 'II')) //filter national parks
        .filter(ee.Filter.bounds(nz1)) //filter only from the boundaries of new zealand
        
print ('No. NPs in NZ:',nz_nps1.size()) //print number
Map.addLayer(nz_nps1,{color:'#B7B5E4'},'NewZealandNps') //look for color palettes in coolors copy the hex add # before
