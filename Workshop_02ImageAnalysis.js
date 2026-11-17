//Computation in Earth Engine 

Map.setOptions('SATELLITE')
var srtm = ee.Image("CGIAR/SRTM90_V4")
Map.addLayer(srtm, {palette: ["544b3d","4e6e58","4c8577","a6ece0","7adfbb",'black'],min: 0,max: 2500}, 'srtm');

// adding constant 10 to pixel numbers
//var srtm_fixed = srtm.add(10)
//Map.addLayer(srtm_fixed, {palette: ["544b3d","4e6e58","4c8577","a6ece0","7adfbb",'black'],min: 0,max: 2500}, 'srtm_fixed');

//if greater than 1800 shows 1 in inspector if less 0 means that greater than 1800 altitude is snow
var snow_line = srtm.gt(1800).selfMask()
var tree_line = srtm.gt(1015).selfMask()
Map.addLayer(snow_line,{paletter:['black','white']},'snow threshold')
Map.addLayer(tree_line,{paletter:['black','green']},'tree threshold')

//Calculate Slope
var slope = ee.Terrain.slope(srtm) // can copy paste from docs the functions then substitute data
Map.addLayer(slope,{palette:['black','white']},'slope') //calculates the slope

//Zoom to Egmont National Park
var protected_areas = ee.FeatureCollection("WCMC/WDPA/current/polygons")
var taranaki = protected_areas.filter(ee.Filter.eq('NAME', 'Egmont National Park'));
Map.addLayer(taranaki, {color: 'orange'}, 'Mt Taranaki')

//Estimate mean slope ee.Reduce.(mean/max/min)
var slopeOutput = slope.reduceRegion({reducer: ee.Reducer.mean(), geometry:taranaki, scale:90})
print ('This is the slope:',slopeOutput)


// Try clipping to see if it's any different.
var taranakiSlope = slope.clip(taranaki)
Map.addLayer (taranakiSlope, {palette: ['white', 'darkred', 'black'], min:0, max:45}, 'taranaki slope')

var slopeOutput2 = taranakiSlope.reduceRegion({reducer: ee.Reducer.mean(), geometry:taranaki, scale:90})
print ('Now compare with this:',slopeOutput2) //shows the same I like the first one more cleaner

//Min max reducer
var elevation = srtm
var elevOutput_Max = elevation.reduceRegion({reducer: ee.Reducer.max(), geometry:taranaki, scale:90})
print ('This is the max', elevOutput_Max)
var elevOutput_Min = elevation.reduceRegion({reducer: ee.Reducer.min(), geometry:taranaki, scale:90})
print ('This is the min', elevOutput_Min)
//Try minMax
//know what the numbers mean
var minmaxelev = elevation.reduceRegion({reducer: ee.Reducer.minMax(), geometry:taranaki, scale:90})
print ('This is the minimum and maximum:', minmaxelev)

//Image Reducers
var dataset = ee.ImageCollection('WORLDCLIM/V1/MONTHLY');
print (dataset)

//get two mins just add /month no.
var jan_climate = ee.Image ("WORLDCLIM/V1/MONTHLY/01")
var july_climate = ee.Image ("WORLDCLIM/V1/MONTHLY/07")

// Select their average temperature bands tavg
var jan_climate_avg = jan_climate.select('tavg').multiply(0.1) // get average band
var july_climate_avg = july_climate.select('tavg').multiply(0.1) // cann add .multiply(0.1) here

//set vis parameters
var meanTemperatureVis = {min: -40,max: 30, palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red'],};
Map.addLayer(jan_climate_avg, meanTemperatureVis, 'janClimate')
Map.addLayer(july_climate_avg, meanTemperatureVis, 'julyClimate')
// Inspect them! darker color hotter jan all red

var annualMeanTemperature = dataset
  .select('tavg')
  .mean()
  .multiply(0.1)
  .rename('ann_avg_t')// this is the reducer

Map.setCenter(71.7, 52.4, 3);
Map.addLayer(annualMeanTemperature, meanTemperatureVis, 'Mean Annual Temperature');


var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2017-01-01', '2017-12-31'); // only images from 2017
var trueColour = landsat.select(['B4', 'B3', 'B2']);
var trueColourVis = {
  min: 0.0,
  max: 0.4,
};
Map.setCenter(146.746, -19.529, 9);
Map.addLayer(trueColour, trueColourVis, 'True Colour Landsat');

var LandsatMedian = trueColour.median()
Map.addLayer(LandsatMedian, trueColourVis, 'True Colour Median');

