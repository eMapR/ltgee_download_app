// v2.4#######################################################################################
// ###### UI STUFF #######################################################################
// #######################################################################################

// LT PARAMS
exports.paramPanel = function(){

  var runParams = [
    {label: 'Max Segments:', value: 6},
    {label: 'Spike Threshold:', value: 0.9},
    {label: 'Vertex Count Overshoot:', value: 3},
    {label: 'Prevent One Year Recovery:', value: true},
    {label: 'Recovery Threshold:', value: 0.25},
    {label: 'p-value Threshold:', value: 0.05},
    {label: 'Best Model Proportion:', value: 0.75},
    {label: 'Min Observations Needed:', value: 6},
  ];

  var paramBoxes = [];
  var paramPanels = [ui.Label('Define Segmentation Parameters',{fontWeight: 'bold'})];
  runParams.forEach(function(param, index){
    var paramLabel = ui.Label(param.label);
    var paramBox = ui.Textbox({value:param.value});
    paramBox.style().set('stretch', 'horizontal');
    var paramPanel = ui.Panel([paramLabel,paramBox], ui.Panel.Layout.Flow('horizontal'));
    paramBoxes.push(paramBox);
    paramPanels.push(paramPanel);
  });

  return ui.Panel(paramPanels, null, {stretch: 'horizontal'});
};

exports.getParams = function(paramPanel){
  

  var prevOneYrRec = paramPanel.widgets().get(4).widgets().get(1).getValue();
  prevOneYrRec = makeBoolean(prevOneYrRec);

  //if(typeof(prevOneYrRec) !== "boolean"){
  //  prevOneYrRec = prevOneYrRec.toLowerCase() != 'false';
  //}

  return { 
    maxSegments:              parseInt(paramPanel.widgets().get(1).widgets().get(1).getValue()),
    spikeThreshold:         parseFloat(paramPanel.widgets().get(2).widgets().get(1).getValue()),
    vertexCountOvershoot:     parseInt(paramPanel.widgets().get(3).widgets().get(1).getValue()),
    preventOneYearRecovery:                                                        prevOneYrRec,
    recoveryThreshold:      parseFloat(paramPanel.widgets().get(5).widgets().get(1).getValue()),
    pvalThreshold:          parseFloat(paramPanel.widgets().get(6).widgets().get(1).getValue()),
    bestModelProportion:    parseFloat(paramPanel.widgets().get(7).widgets().get(1).getValue()),
    minObservationsNeeded:    parseInt(paramPanel.widgets().get(8).widgets().get(1).getValue())
  };
};



// DOUBLE INDEX PANEL (FIT TO VERTEX)
exports.indexSelectPanel = function(){
  var indexLabel = ui.Label('Select Source Index ',{fontWeight: 'bold'});
  var indexList = ['NBR','NDVI','NDSI','NDMI','TCB','TCG','TCW','B1','B2','B3','B4','B5','B7','NBRz','Band5z','ENC'];
  var indexSelect = ui.Select({items:indexList, value:'NBR', style:{stretch: 'horizontal'}});
  var fitLabel = ui.Label('Select Index To Be Fitted To Source Index.',{fontWeight: 'bold'});
  var fitSelect = ui.Select({items:indexList, value:'NBR', style:{stretch: 'horizontal'}});
  return ui.Panel([indexLabel,indexSelect,fitLabel,fitSelect], null, {stretch: 'horizontal'});
};

exports.indexSelectGet = function(indexSelectPanel){
  return [indexSelectPanel.widgets().get(1).getValue(),indexSelectPanel.widgets().get(3).getValue()];
};







// SINGLE VIS PANEL
exports.visSelectPanel = function(){
  var indexLabel = ui.Label('Select RGB Combo',{fontWeight: 'bold'});
  var indexList = ['TCB/TCG/TCW','SWIR1/NIR/RED','NIR/RED/GREEN','RED/GREEN/BLUE','NIR/SWIR1/RED'];
  var indexSelect = ui.Select({items:indexList, value:'SWIR1/NIR/RED', style:{stretch: 'horizontal'}});
  return ui.Panel([indexLabel,indexSelect], null, {stretch: 'horizontal'});
};

exports.visSelectGet = function(indexSelectPanel){
  return indexSelectPanel.widgets().get(1).getValue();
};




// MULTI-INDEX PANEL
exports.indexSelectPanelTS = function(){
  var indexListTS = [['NBR',-1], ['NDVI',-1], ['NDMI',-1], ['TCB',1], ['TCG',-1],
                    ['TCW',-1], ['TCA' ,-1], ['B1' ,1], ['B2' , 1],
                    ['B3' , 1], ['B4'  ,-1], ['B5'  , 1], ['B7' ,1], ['NBRz',1],['B5z',1],['ENC', 1]];
  
  var indexBoxes = [];
  indexListTS.forEach(function(name, index) {
    var checkBox = ui.Checkbox(name[0]);
    indexBoxes.push(checkBox);
  });
/*  
  var indexLabel = ui.Label('Select Indices', {fontWeight : 'bold'});
  var indexPanel = ui.Panel(
    [
      ui.Panel([indexBoxes[0], indexBoxes[4], indexBoxes[8], indexBoxes[12]], null, {stretch: 'horizontal'}),
      ui.Panel([indexBoxes[1], indexBoxes[5], indexBoxes[9], indexBoxes[13]], null, {stretch: 'horizontal'}),
      ui.Panel([indexBoxes[2], indexBoxes[6], indexBoxes[10]], null, {stretch: 'horizontal'}),
      ui.Panel([indexBoxes[3], indexBoxes[7], indexBoxes[11]], null, {stretch: 'horizontal'})
    ],
    ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'}
  );
  
  indexBox[0].setValue(1)
  return {panel:ui.Panel([indexLabel,indexPanel], null, {stretch: 'horizontal'}), indexBoxes:indexBox};
*/
  return {ui:indexBoxes, list:indexListTS};
};





// MASK PANEL
exports.maskSelectPanel = function(){
  var maskLabel = ui.Label('Define Mask Elements',{fontWeight: 'bold'});
  var maskPanel = ui.Panel([
    ui.Panel([ui.Checkbox({label:'Clouds', value:1}),ui.Checkbox({label:'Shadows', value:1}),ui.Checkbox({label:'Snow', value:1})],ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'}),
    ui.Panel([ui.Checkbox({label:'Water', value:1}),ui.Checkbox({label:'WaterPlus', value:1}),ui.Checkbox({label:'NonForest', value:0})],ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
  ]);
  return ui.Panel([maskLabel, maskPanel]);
};

exports.getMaskSelect = function(maskSelectPanel){
  var selectionBoo = [
    maskSelectPanel.widgets().get(1).widgets().get(0).widgets().get(0).getValue(),
    maskSelectPanel.widgets().get(1).widgets().get(0).widgets().get(1).getValue(),
    maskSelectPanel.widgets().get(1).widgets().get(0).widgets().get(2).getValue(),
    maskSelectPanel.widgets().get(1).widgets().get(1).widgets().get(0).getValue(),
    maskSelectPanel.widgets().get(1).widgets().get(1).widgets().get(1).getValue(),  
    maskSelectPanel.widgets().get(1).widgets().get(1).widgets().get(2).getValue()
  ];
  

  
  var selection = [];
  if(selectionBoo[0] === true){selection.push('cloud')}
  if(selectionBoo[1] === true){selection.push('shadow')}
  if(selectionBoo[2] === true){selection.push('snow')}
  if(selectionBoo[3] === true){selection.push('water')}
  if(selectionBoo[4] === true){selection.push('waterplus')}
  if(selectionBoo[5] === true){selection.push('nonforest')}
  


  return selection;
};




// YEAR PANEL
exports.colYearsPanel = function(){
  var yearSectionLabel = ui.Label('Define Year Range',{fontWeight: 'bold'});
  
  var startYearLabel = ui.Label('Start Year:');
  var startYearslider = ui.Slider({min:1984, max:2001, value:1984, step:1});
  startYearslider.style().set('stretch', 'horizontal');
  
  var endYearLabel = ui.Label('End Year:');
  var endYearslider = ui.Slider({min:2018, max:2021, value:2021, step:1});
  endYearslider.style().set('stretch', 'horizontal');
  
  return ui.Panel(
    [
      yearSectionLabel,
      ui.Panel([startYearLabel, startYearslider], ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'}), //
      ui.Panel([endYearLabel  , endYearslider], ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
    ] 
  );
};

exports.colYearsGet = function(colYearsPanel){
  return {
    startYear:colYearsPanel.widgets().get(1).widgets().get(1).getValue(),
    endYear:colYearsPanel.widgets().get(2).widgets().get(1).getValue()
  };
};

// FRAMES PER SECOND
exports.fpsPanel = function(){
  var fpsSectionLabel = ui.Label('Define Frames Per Second',{fontWeight: 'bold'});
  var fpsSlider = ui.Slider({min:1, max:30, value:5, step:1});
  fpsSlider.style().set('stretch', 'horizontal');

  return ui.Panel(
    [
      fpsSectionLabel,
      ui.Panel([fpsSlider], ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
    ] 
  );
};

exports.fpsGet = function(fpsPanel){
  return fpsPanel.widgets().get(1).widgets().get(0).getValue();
};





// DATE PANEL
exports.colDatesPanel = function(){
  var dateSectionLabel = ui.Label('Define Date Range (month-day)',{fontWeight: 'bold'});
  var startDayLabel = ui.Label('Start Date:');
  var startDayBox = ui.Textbox({value:'06-10'});
  startDayBox.style().set('stretch', 'horizontal');
  
  var endDayLabel = ui.Label('End Date:');
  var endDayBox = ui.Textbox({value:'09-20'});
  endDayBox.style().set('stretch', 'horizontal');
  
  return ui.Panel(
    [
      dateSectionLabel,
      ui.Panel(
        [startDayLabel, startDayBox, endDayLabel, endDayBox],
        ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'}
      )
    ]
  );
};

exports.colDatesGet = function(colDatesPanel){

  return {
    startDate:colDatesPanel.widgets().get(1).widgets().get(1).getValue(),
    endDate:colDatesPanel.widgets().get(1).widgets().get(3).getValue()
  };
};







// OVERLAY PANEL
exports.LayerOverlayPanel = function(){
  
  var checkLabell = ui.Label('Use first file path as AOI', {fontWeight: 'bold'});
  var checkboxx = ui.Checkbox({label: 'Use the first file path to process imagery as area of interest.'});
  //return ui.Panel([checkLabel, checkbox], ui.Panel.Layout.Flow('vertical'), {stretch: 'horizontal'});

  
  
  var assetPathLabel = ui.Label('Define the file path to an asset.',{fontWeight: 'bold'});
  var fileLabel = ui.Label('File Path:');
  var pathBox = ui.Textbox({value:'file/path/to/asset'});
  var pathBox1 = ui.Textbox({value:'file/path/to/asset'});
  var pathBox2 = ui.Textbox({value:'file/path/to/asset'});
  pathBox.style().set('stretch', 'vertical');
  pathBox1.style().set('stretch', 'vertical');
  pathBox2.style().set('stretch', 'vertical');
  
  


  var layerNameLabel = ui.Label('Define Layer Name',{fontWeight: 'bold'});
  var lyrNameLabel = ui.Label('Name:');
  var lyrNameBox = ui.Textbox({value:'Name of layer'});
  var lyrNameBox1 = ui.Textbox({value:'Name of layer'});
  var lyrNameBox2 = ui.Textbox({value:'Name of layer'});
  lyrNameBox.style().set('stretch', 'vertical');
  lyrNameBox1.style().set('stretch', 'vertical');
  lyrNameBox2.style().set('stretch', 'vertical');
  
  var colorLabel = ui.Label("Define the Layer's color",{fontWeight: 'bold'});
  var lyrcolorLabel = ui.Label('Color:');
  var lyrcolorBox = ui.Textbox({value:'green'});
  var lyrcolorBox1 = ui.Textbox({value:'red'});
  var lyrcolorBox2 = ui.Textbox({value:'blue'});
  lyrNameBox.style().set('stretch', 'vertical');
  lyrNameBox1.style().set('stretch', 'vertical');
  lyrNameBox2.style().set('stretch', 'vertical');


  
  return ui.Panel(
    [
      

      
      assetPathLabel,
      ui.Panel(
        [fileLabel, pathBox, pathBox1, pathBox2],
        ui.Panel.Layout.Flow('vertical'), {stretch: 'vertical'}),
        
      layerNameLabel,
      ui.Panel(
        [lyrNameLabel, lyrNameBox, lyrNameBox1, lyrNameBox2],
        ui.Panel.Layout.Flow('vertical'), {stretch: 'vertical'}),
        
      colorLabel,
      ui.Panel(
        [lyrcolorLabel, lyrcolorBox, lyrcolorBox1, lyrcolorBox2],
        ui.Panel.Layout.Flow('vertical'), {stretch: 'vertical'}),
        
      checkLabell,
      ui.Panel(
        [checkboxx], 
        ui.Panel.Layout.Flow('vertical'), {stretch: 'horizontal'}),
    ]
  );
};

exports.lyrOverlayGet = function(LayerOverlayPanel){

  return [

    
    LayerOverlayPanel.widgets().get(1).widgets().get(1).getValue(),
    LayerOverlayPanel.widgets().get(1).widgets().get(2).getValue(),
    LayerOverlayPanel.widgets().get(1).widgets().get(3).getValue(),
    
    LayerOverlayPanel.widgets().get(3).widgets().get(1).getValue(),
    LayerOverlayPanel.widgets().get(3).widgets().get(2).getValue(),
    LayerOverlayPanel.widgets().get(3).widgets().get(3).getValue(),
    
    LayerOverlayPanel.widgets().get(5).widgets().get(1).getValue(),
    LayerOverlayPanel.widgets().get(5).widgets().get(2).getValue(),
    LayerOverlayPanel.widgets().get(5).widgets().get(3).getValue(),
    
    LayerOverlayPanel.widgets().get(7).widgets().get(0).getValue(),
  ];
};







var rgbYearsGet = ee.Dictionary({red:1990,green:2000,blue:2010})

// RGB YEAR PANEL
exports.rgbYearsPanel = function(){
  
  var rgbSectionLabel = ui.Label('Define Years for Red, Green, Blue',{fontWeight: 'bold'});
  
  var redYearLabel = ui.Label('Red Year:');
  var redYearslider = ui.Slider({min:1984, max:2021, value:1990, step:1, style:{stretch: 'horizontal'}});
  
  var greenYearLabel = ui.Label('Green Year:');
  var greenYearslider = ui.Slider({min:1984, max:2021, value:2000, step:1, style:{stretch: 'horizontal'}});
  
  var blueYearLabel = ui.Label('Blue Year:');
  var blueYearslider = ui.Slider({min:1984, max:2021, value:2010, step:1, style:{stretch: 'horizontal'}});
  
  var rgbYearsPanel = ui.Panel([
      rgbSectionLabel,
      ui.Panel([redYearLabel, redYearslider], ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'}),
      ui.Panel([greenYearLabel, greenYearslider], ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'}),
      ui.Panel([blueYearLabel, blueYearslider], ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
    ] 
  );
  return rgbYearsPanel;
};

exports.rgbYearsGet = function(rgbYearsPanel){
  return {
    red: rgbYearsPanel.widgets().get(1).widgets().get(1).getValue(),
    green: rgbYearsPanel.widgets().get(2).widgets().get(1).getValue(),
    blue: rgbYearsPanel.widgets().get(3).widgets().get(1).getValue(),
  };
};



// YEAR PANEL - SIDE-BY-SIDE
exports.twoYearPanel = function(){
  var twoYearSectionLabel = ui.Label('Define Left & Right Map Years',{fontWeight: 'bold'});
  var leftYearLabel = ui.Label('Left:');
  var leftYearBox = ui.Textbox({value:'1984'});
  leftYearBox.style().set('stretch', 'horizontal');
  
  var rightYearLabel = ui.Label('Right:');
  var rightYearBox = ui.Textbox({value:'2021'});
  rightYearBox.style().set('stretch', 'horizontal');
  
  return ui.Panel(
    [
      twoYearSectionLabel,
      ui.Panel(
        [leftYearLabel, leftYearBox, rightYearLabel, rightYearBox],
        ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'}
      )
    ]
  );
};

exports.twoYearGet = function(twoYearPanel){
  return {
    leftYear:twoYearPanel.widgets().get(1).widgets().get(1).getValue(),
    rightYear:twoYearPanel.widgets().get(1).widgets().get(3).getValue()
  };
};



// COORDINATE PANEL
exports.coordsPanel = function(){
  var coordSectionLabel = ui.Label('Click a point on the map, or enter pixel coordinates. (optional)',{fontWeight: 'bold'});
  
  var latLabel = ui.Label('Latitude:');
  var latBox = ui.Textbox({value:43.7929});
  latBox.style().set('stretch', 'horizontal');
  
  var lonLabel = ui.Label('Longitude:');
  var lonBox = ui.Textbox({value:-122.8848});
  lonBox.style().set('stretch', 'horizontal');
  
  return ui.Panel(
    [
      coordSectionLabel,
      ui.Panel([lonLabel, lonBox, latLabel, latBox],ui.Panel.Layout.Flow('horizontal'))
    ],
    null,
    {stretch: 'horizontal'}
  );
};

exports.coordsGet = function(coordsPanel){
    return {
      lon:parseFloat(coordsPanel.widgets().get(1).widgets().get(1).getValue()),
      lat:parseFloat(coordsPanel.widgets().get(1).widgets().get(3).getValue())
  };
};



// BUFFER PANEL
exports.bufferPanel = function(userProps){
  var panelLabel = userProps.panelLabel || 'Define an image buffer around coordinates (km)';
  var varLabel = userProps.varLabel || 'Buffer:';
  var defVar = userProps.defVar || 50;
  var bufferSectionLabel = ui.Label(panelLabel,{fontWeight: 'bold'});
  var bufferBoxLabel = ui.Label(varLabel);
  var bufferBox = ui.Textbox({value: defVar, style:{stretch: 'horizontal'}});
  return ui.Panel(
    [
      bufferSectionLabel,
      ui.Panel([bufferBoxLabel,bufferBox], ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
    ]
  );
};

exports.getBuffer = function(bufferPanel){
  return parseInt(bufferPanel.widgets().get(1).widgets().get(1).getValue());
};


// REGION DRAWING CHECKBOX
exports.drawPolygonPanel = function(){
  var checkLabel = ui.Label('Select option below, then click point on map (optional)', {fontWeight: 'bold'});
  var checkbox = ui.Checkbox({label: ' Draw Option: Click to create polygon(s) then select options below.'});
  return ui.Panel([checkLabel, checkbox], ui.Panel.Layout.Flow('vertical'), {stretch: 'horizontal'});
};
exports.getDrawPolygon = function(drawPolygonPanel){
  return drawPolygonPanel.widgets().get(1).getValue();
};

// DSNR CHECKBOX
exports.DSNRPanel = function(){
  var checkbox = ui.Checkbox({label: ' Apply DSNR *Not Functional Yet*'});
  return ui.Panel([checkbox], ui.Panel.Layout.Flow('vertical'), {stretch: 'horizontal'});
};

exports.getDSNR = function(DSNRPanel){
  return DSNRPanel.widgets().get(1).getValue();
};

// Add RGB Imagery BUTTON
exports.submitButton = function(){
  return ui.Button({label: 'Add RGB Imagery', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};

// TimeSeries BUTTON
exports.TimeSeriesButton = function(){
  return ui.Button({label: 'Submit Pixel', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};

// YOD BUTTON
exports.YODButton = function(){
  return ui.Button({label: 'Add Filtered Disturbance Imagery', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};

//Add full time series BUTTON
exports.timeSeriesButton = function(){
  return ui.Button({label: 'Add Full Time Series Imagery', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};

//Add Asset BUTTON
exports.assetButton = function(){
  return ui.Button({label: 'Add Asset to Map', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};

// first Delta BUTTON
exports.deltaButtonRG = function(){
  return ui.Button({label: 'Add Red To Green Delta Imagery', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};

// first Delta BUTTON
exports.deltaButtonGB = function(){
  return ui.Button({label: 'Add Green To Blue Delta Imagery', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};
// DOWNLOADS  ================================================================================

exports.DownloadPanel = function(){
  var downloadLabel = ui.Label('Download Selection',{fontWeight: 'bold'});
  var downloadPanel = ui.Panel([
      ui.Checkbox({label:'Download RGB Imagery', value:1}),
      ui.Checkbox({label:'Download RG Delta Imagery', value:0}),
      ui.Checkbox({label:'Download GB Delta Imagery', value:0}),
      ui.Checkbox({label:'Download Change Imagery', value:0}),
      ui.Checkbox({label:'Download Full TimeSeries Imagery', value:0})],ui.Panel.Layout.Flow('vertical'), {stretch: 'horizontal'});
  return ui.Panel([downloadLabel, downloadPanel]);
  
};

exports.getdownloadpanel = function(DownloadPanel){
  
  var downloadSelBoo = [
    DownloadPanel.widgets().get(1).widgets().get(0).getValue(),
    DownloadPanel.widgets().get(1).widgets().get(1).getValue(),
    DownloadPanel.widgets().get(1).widgets().get(2).getValue(),
    DownloadPanel.widgets().get(1).widgets().get(3).getValue(),
    DownloadPanel.widgets().get(1).widgets().get(4).getValue() 

  ];
  
  
  
  var downloading = [];
  
  if(downloadSelBoo[0] === true){downloading.push(1)}
  if(downloadSelBoo[1] === true){downloading.push(2)}
  if(downloadSelBoo[2] === true){downloading.push(3)}
  if(downloadSelBoo[3] === true){downloading.push(4)}
  if(downloadSelBoo[4] === true){downloading.push(5)}
  
  return downloading
};

//Imagery download BUTTON
exports.downloadButton = function(){
  return ui.Button({label: 'Download data', style:{stretch: 'horizontal', width: '200px', color: 'blue'}});
};

// HELPERS
var makeBoolean = function(value){
  if(typeof(value) !== "boolean"){
    value = value.toLowerCase() != 'false';
  }
  return value;
};

