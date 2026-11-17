// Start of Workshop 3
//load population dataset
Map.setOptions('SATELLITE') //try snazzy maps
var population = ee.ImageCollection("CIESIN/GPWv411/GPW_Population_Count")
//load nightlights take note of stable_lights
var nightlights = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS")
//visualization
print (population)
var population_2000 = ee.Image("CIESIN/GPWv411/GPW_Population_Count/gpw_v4_population_count_rev11_2000_30_sec")
var population_2015 = ee.Image("CIESIN/GPWv411/GPW_Population_Count/gpw_v4_population_count_rev11_2015_30_sec")
print (population_2000)
print (population_2015)
var population_vis = {'max': 1000.0,'palette': ['ffffe7','86a192','509791','307296','2c4484','000066'],'min': 0.0};
Map.addLayer(population_2000, population_vis, 'population_count_2000');
Map.addLayer(population_2015, population_vis, 'population_count_2015');

//do this for nightlights with the images we want then select and rename
var nl_2000 = ee.Image ('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F142000').select(['avg_vis'], ['nightlight']) //changes the band name from avg_vis to nifhtlight
var nl_2013 = ee.Image ('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182013').select(['avg_vis'], ['nightlight']) //selects makes you select what band you want
print ('nightlight 2000 processed', nl_2000)
print ('nightlight 2013 processed', nl_2013)

var nightlight_vis = {'max': 67.0,'palette': ["black","grey","584d3d","9f956c","cbbf7a","f4e87c","ebf38b"],'min': 0.0}; //how to know what for min and max click on something with prior expectation like ocean which has no light then do it for brightest like singapore. or can use gear function on the layers

Map.addLayer(nl_2000, nightlight_vis, 'Nighttime Lights 2000');
Map.addLayer(nl_2013, nightlight_vis, 'Nighttime Lights 2013'); // stopped at 2013 because data was looked into until 2014 can see on description

var grid = ee.FeatureCollection('users/murrnick/mb5370/worldgrid_5deg');
Map.addLayer (grid, {color:'purple'}, '5 degree grid') //can add false so its ticked off after loaded and add opacity
// good to print to know whats inside like in nl 2304 elements


var coast = ee.FeatureCollection('projects/UQ_intertidal/dataMasks/naturalEarthCoastline_v1')
Map.addLayer (coast, {color:'yellow'}, 'coast') //coastline dataset

var coastGrids = grid.filter(ee.Filter.bounds(coast)); //filter to coastline boundaries
Map.addLayer(coastGrids, {color: 'gray'}, 'coast grids'); //add layer coastGrids

var pop_change = population_2015.subtract(population_2000).clip(coastGrids) // remember this should be your grid
Map.addLayer (pop_change, {palette:  ['red', 'black', 'lime'], min: -500, max: 500}, 'pop_change', true, 0.9)

var nl_change = nl_2013.subtract(nl_2000).clip(coastGrids) // clip it to the coastal ecoregions/grids
Map.addLayer (nl_change, {palette:  ['red', 'black', 'lime'], min: -50, max: 50}, 'nl_change', true, 0.9)

var nl_changePergrid = nl_change.reduceRegions({collection: coastGrids, reducer: ee.Reducer.mean(), scale: 1000, }); // note computing at a larger scale for speed 1000 means the resolution of dataset
print ('First coastal grid - nightlight change',nl_changePergrid.first()) // look at properties of the first one

var pop_changePergrid = pop_change.reduceRegions({collection: coastGrids, reducer: ee.Reducer.mean(), scale: 1000, }); // note computing at a larger scale for speed
print ('First coastal grid - population change',pop_changePergrid.first()) // look at properties of the first one

// Export the result
// Approx 10-20 minute export for scale = 1000.
// Export the result to asset
Export.table.toAsset({collection: pop_changePergrid,description: 'export_pop_toAsset', assetId:'pop_changePergrid'}); // analysis on export mode assetId is my asset ID

Export.table.toAsset({collection: nl_changePergrid,description: 'export_nl_toAsset',assetId:'nl_changePergrid'});

var pop_result = ee.FeatureCollection('projects/melodic-bolt-514323-f2/assets/nl_changePergrid')
Map.addLayer(pop_result)
print (pop_result)

// Visualise result
var empty = ee.Image().byte() // make an empty image
var palette = ["ffb86f","e0ca3c","ba5c12","3e2f5b","261132"];
var pop_changPergrid = empty.paint({featureCollection: pop_result,color: 'mean'});

Map.addLayer(pop_changPergrid, {max: 112, palette: palette}, 'popChange_result');
