//Start of Workshop 2

var wdpa = ee.FeatureCollection("WCMC/WDPA/current/polygons") //load protected areas
var national_parks = wdpa.filter(ee.Filter.eq('IUCN_CAT', 'II')); //filter only catefory 2 or National Parls
print('National parks size:', national_parks.size());
Map.addLayer(national_parks, {color: 'lime'}, 'national parks'); //add layer named (national parks)

var countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017"); //load countries
print ('no. of countries',countries.size()); //number of countries
Map.addLayer(countries) //add layer countries

//Filter New zealand
var nz = countries.filter(ee.Filter.eq('country_co', 'NZ')); //filter to NZ
Map.addLayer(nz, {color: 'white'}, 'nz'); //add to map

//Quantify number of PAs in NZ
var nz_pas = wdpa.filter(ee.Filter.bounds(nz)); //filter to new zealand boundaries
print('No. of pas in NZ:', nz_pas.size()); //number of protected areas in nz 10130
Map.addLayer(nz_pas, {color: 'pink'}, 'nz_pas'); //add layer nz_pas

var national_parks_nz = nz_pas.filter(ee.Filter.eq('IUCN_CAT', 'II')); //filter only category 2 or national parks for nz
print('New Zealand no. of PAs:', national_parks_nz.size()); //how many category 2 in nz?
Map.addLayer(national_parks_nz, {color: 'indigo'}, 'nz national parks'); //18 national parks

//making workflow efficient compare with the one above
var nz1 = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017") // Import countries
    .filter(ee.Filter.eq('country_co','NZ')) // filter new zealand from country_co
    
var nz_nps1 = ee.FeatureCollection("WCMC/WDPA/current/polygons") //load protected areas
        .filter(ee.Filter.eq('IUCN_CAT', 'II')) //filter national parks
        .filter(ee.Filter.bounds(nz1)) //filter only from the boundaries of new zealand
        
print ('No. NPs in NZ:',nz_nps1.size()) //print number
Map.addLayer(nz_nps1,{color:'#B7B5E4'},'NewZealandNps') //look for color palettes in coolors copy the hex add # before
