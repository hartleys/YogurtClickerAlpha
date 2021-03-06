
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// SET FINAL VARS:



GAME_GLOBAL.SCIENCE_DISPLAY   = SCIENCE_DISPLAY;
GAME_GLOBAL.SCIENCE_TYPES     = SCIENCE_TYPES;
GAME_GLOBAL.SCIENCE_SUBFIELDS = SCIENCE_SUBFIELDS;

GAME_GLOBAL.STAR_TYPE_SET = STAR_TYPE_SET;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///MAIN TICK CYCLE:
//GAME_GLOBAL.TICK_scoutSystems()

var TICK_TIMESTAMP
var secTimer = 0;
var midTimer = 0;

STATS["PAUSE"] = false;

//var bgStatic = document.getElementById("BACKGROUND_STATIC")
//var vgCanvas = document.getElementById("BACKGROUND_CANVAS")
//var allContentContainer =

function resizeBackgroundCanvas(){
        GAME_GLOBAL.bgStatic.style.height = GAME_GLOBAL.ALL_CONTENT_CONTAINER.offsetHeight + "px"
        GAME_GLOBAL.bgCanvas.style.height = GAME_GLOBAL.ALL_CONTENT_CONTAINER.offsetHeight + "px"
}
window.addEventListener('resize', resizeBackgroundCanvas);
window.addEventListener('load', resizeBackgroundCanvas);

resizeBackgroundCanvas()

window.GAME = GAME_GLOBAL;

function TICK_runFastTick(){
    var GAME = this.GAME;
    if(GAME.STATS["TICK"] < 10){
      GAME.bgStatic.style.height = GAME.ALL_CONTENT_CONTAINER.offsetHeight + "px"
     // GAME.bgCanvas.style.height = GAME.ALL_CONTENT_CONTAINER.offsetHeight + "px"
    }
    
    if(! STATS["PAUSE"]){
        TICK_TIMESTAMP = Date.now()
        GAME.STATS["TICK"] = GAME.STATS["TICK"] + 1;
        GAME.TICK_readUserInputs()
        GAME.TICK_updateStats()
        GAME.TICK_scoutSystems()
        GAME.TICK_captureSystems()
        GAME.TICK_calcWar()
        GAME.TICK_constructWorlds()
        GAME.TICK_updateWorldCounts()
        
        
        GAME.TICK_INDUSTRY_calcPOWERGEN();
        GAME.TICK_INDUSTRY_addCReqs()
        GAME.executeAllConstructionRequests()
        GAME.TICK_calcIndustry();
        GAME.TICK_INDUSTRY_calcScienceGain();
        GAME.TICK_INDUSTRY_calcPowerUsage();
        
        
        
        secTimer++;
        if (secTimer >= 250){
          secTimer = 0;
          calculateSlowTick();
        }
        if(GAME.STATS["CRAZY_ON"]){
           GAME.SLOWTICK_makeCrazy();
        }

        //GAME.bgStatic.style.height = GAME.ALL_CONTENT_CONTAINER.offsetHeight + "px"
        //GAME.bgCanvas.style.height = GAME.ALL_CONTENT_CONTAINER.offsetHeight + "px"

        midTimer++;
        if(midTimer >= 5){
            midTimer = 0;
          if(bgCanvas.RUN_STATIC){
            requestAnimFrame(tvStatic_render);
          }
        }



        /*staticCanvas(bgCanvas)*/
    }

    if(SAVE_GAME_COMMAND_FLAG.length > 0){
      if( SAVE_GAME_COMMAND_FLAG[0] == "SAVE"){
        writeSavegameObject(getCurrentSavegameObject(),SAVE_GAME_COMMAND_FLAG[1])
      } else if(SAVE_GAME_COMMAND_FLAG[0] == "LOAD"){
        loadSavegameObject(getSavegameObject(SAVE_GAME_COMMAND_FLAG[1]))
        TICK_setUserInputs();
      }
      SAVE_GAME_COMMAND_FLAG = []
    }

}

window.setInterval(TICK_runFastTick,100);


var varNumTicksSoFar = 0
function calculateSlowTick(){
    varNumTicksSoFar = varNumTicksSoFar + 1
    TICK_calcScience();
    /*printlnToAiConsole("" + varNumTicksSoFar+" secTimer = "+secTimer)*/

}
//SETTINGS["bio"+"_FRACTION"]

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TICK FUNCTIONS:

//SETTINGS["bot"+"_FRACTION"]
function TICK_readUserInputs(){
  //Percent sliders:
  for(var i =0; i<this.PCTSLIDER_FIELDS.length; i++){
    var fid = this.PCTSLIDER_FIELDS[i]
    this.SETTINGS[fid+"_FRACTION"] = [];
    this.SETTINGS[fid+"_LOCKEDBOX"] = [];
    for(var j=0;j<this.PCTSLIDERS[fid]["displayElem"].length;j++){
      this.SETTINGS[fid+"_FRACTION"][j] = parseFloat( this.PCTSLIDERS[fid]["sliderElem"][j].value ) / 10000
      this.SETTINGS[fid+"_LOCKEDBOX"][j] = this.PCTSLIDERS[fid]["sliderElem"][j].lockbox.checked
      //this.updatePctSliderDisplay(this.PCTSLIDERS[fid]["sliderElem"][j])
    }
  }
  
  
    for(var i=0; i < STATICVAR_HOLDER.POWER_SOURCEWORLD_LIST.length; i++){
      var worldType = STATICVAR_HOLDER.POWER_SOURCEWORLD_LIST[i];
      var ppid = STATICVAR_HOLDER.POWER_SOURCE_LIST[i]
      this.SETTINGS[ppid+"_POWERLIMITFRAC"] = parseFloat(ELEMS[worldType+"PowerLimiter"].value) / 10000
    }

  this.SETTINGS["BIOMASS_PROD_FRAC"] = this.ELEMS["BIOMASS_CONTROL_SLIDER"].currValue;
  this.SETTINGS["BIOMASS_PWR_FRAC"] = 1 - this.SETTINGS["BIOMASS_PROD_FRAC"]
}

function TICK_setUserInputs(){
  //Percent sliders:
  for(var i =0; i<this.PCTSLIDER_FIELDS.length; i++){
    var fid = this.PCTSLIDER_FIELDS[i]
    for(var j=0;j<this.PCTSLIDERS[fid]["displayElem"].length;j++){
      this.PCTSLIDERS[fid]["sliderElem"][j].value = this.SETTINGS[fid+"_FRACTION"][j] * 10000;
      this.PCTSLIDERS[fid]["sliderElem"][j].lockbox.checked = this.SETTINGS[fid+"_LOCKEDBOX"][j];
    }
  }


}


//STATS["CONVERSIONS"]["sunToByte"] = 1243912971288
//STATS["CONVERSIONS"]["opToIdent"] = 0.000000001
//STATS["CONVERSIONS"]["sunToOp"] =   3745454516355
//STATS["CONVERSIONS"]["opToByte"]

//PRODUCTIVITY_STATS = ["bot","psy","green","bio","eng","psy","think","soul"]
//STATS["PRODUCTIVITY_RATING"] = {}
//STATS["PRODUCTIVITY_MULT"] = {}
STATS["PRODUCTIVITY"] = {};

function TICK_updateStats(){
/*

//MATTER-Botbots-CT
//MATTER-Biomass-CT
//MATTER-Compute-CT

*/
  this.STATS["PRODUCTIVITY_RATING"]["bot"]   = this.INVENTORY["MATTER-Botbots-CT"] * this.STATS["PRODUCTIVITY_MULT"]["bot"]
  this.STATS["PRODUCTIVITY_RATING"]["green"]   = this.INVENTORY["MATTER-Biomass-CT"] * this.STATS["PRODUCTIVITY_MULT"]["green"] * this.SETTINGS["BIOMASS_PROD_FRAC"]
  this.STATS["PRODUCTIVITY_RATING"]["comp"]   = this.INVENTORY["MATTER-Compute-CT"] * this.STATS["PRODUCTIVITY_MULT"]["comp"] * this.STATS["CONVERSIONS"]["sunToOp"]

  this.STATS["PRODUCTIVITY_RATING"]["ship"]   = this.STATS["PRODUCTIVITY_RATING"]["bot"] * SETTINGS["bot_FRACTION"][4]
  this.STATS["PRODUCTIVITY_RATING"]["think"] = this.STATS["PRODUCTIVITY_RATING"]["comp"] * this.SETTINGS["comp_FRACTION"][0]
  this.STATS["PRODUCTIVITY_RATING"]["soul"] = this.STATS["PRODUCTIVITY_RATING"]["comp"] * this.SETTINGS["comp_FRACTION"][1] * this.STATS["CONVERSIONS"]["opToSoul"]

  this.STATS["PRODUCTIVITY_RATING"]["bio"]   = this.STATS["CONVERSIONS"]["sunToByte"] * this.STATS["PRODUCTIVITY_RATING"]["green"] * this.SETTINGS["green_FRACTION"][0]
  this.STATS["PRODUCTIVITY_RATING"]["eng"]   = this.STATS["CONVERSIONS"]["opToByte"]  * this.STATS["PRODUCTIVITY_RATING"]["think"] * this.SETTINGS["think_FRACTION"][1]
  this.STATS["PRODUCTIVITY_RATING"]["psy"]   =  this.STATS["PRODUCTIVITY_RATING"]["soul"] * this.SETTINGS["soul_FRACTION"][0]

   this.STATS["PRODUCTIVITY_RATING"]["scout"]   = Math.floor(this.INVENTORY["SHIPS-"+"scout"+"-CT"])
   this.STATS["PRODUCTIVITY_RATING"]["battleplate"]   = Math.floor(this.INVENTORY["SHIPS-"+"battleplate"+"-CT"])
   this.STATS["PRODUCTIVITY_RATING"]["seedship"]   = Math.floor(this.INVENTORY["SHIPS-"+"seedship"+"-CT"])



  for(var sfi = 0; sfi < this.PCTSLIDER_FIELDS.length; sfi++){
      var fid = this.PCTSLIDER_FIELDS[sfi]
      if(ELEMS[fid+"_PRODUCTIVITY_DISPLAY"] != null){
        var fsi = fmtSIunits( this.STATS["PRODUCTIVITY_RATING"][fid] * this.STATS["PRODUCTIVITY_MULT"][fid] / this.STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR)
        var makeAnonFunc = function(xfid,xfsi){
          //console.log("making anon: ["+xfid+"]");
          return function(){
            //console.log("setting prodDisplay: ["+xfid+"]");
            this.GAME.ELEMS[xfid+"_PRODUCTIVITY_DISPLAY"].innerHTML = xfsi[0]+" "+xfsi[1]+this.GAME.PCTSLIDER_DISPLAYUNITS[xfid]
          }
        }
        var anonFunc = makeAnonFunc(fid,fsi)
        window.requestAnimationFrame(anonFunc)
      }
      
      for( var i=0; i < this.PCTSLIDERS[fid]["sliderElem"].length; i++){
        this.updatePctSliderDisplayHelper( this.PCTSLIDERS[fid]["sliderElem"][i] )
      }
      
      //this.updatePctSliderDisplay(this.PCTSLIDERS[fid]["sliderElem"][0])
  }
  
  window.requestAnimationFrame(function(){
    this.GAME.DEBUG_CRAZY_LEVEL_DISPLAY.innerHTML = this.GAME.STATS["CRAZY_LEVEL"]
    this.GAME.DATE_DISPLAY.innerHTML = this.GAME.getDateStringFromTick(this.STATS["TICK"])
    this.GAME.MOOD_DISPLAY.innerHTML = this.GAME.STATS["MOOD"]
  })
  


  this["INVENTORY-PREVTICK"] = {};
  for( var i = 0; i < this.MATTER_TYPE_LIST.length; i++){
        var matterType = this.MATTER_TYPE_LIST[i]
        this["INVENTORY-PREVTICK"]["MATTER-"+matterType+"-CT"] = this.INVENTORY["MATTER-"+matterType+"-CT"]
  }

}
function getTimeStringFromTick(tt){
  var y =  Math.floor( tt * STATS["CONVERSIONS"]["yearPerTick"] );
  var wk = tt - y / STATS["CONVERSIONS"]["yearPerTick"];
  return (y)+ " years, "+Math.floor(wk) +" weeks"
}

function getDateStringFromTick(tt){
  var y =  Math.floor( tt * STATS["CONVERSIONS"]["yearPerTick"] );
  var wk = tt - y / STATS["CONVERSIONS"]["yearPerTick"];
  return (y + STATS["CONVERSIONS"]["timeAtZero"])+ ", wk"+Math.floor(wk)
}

for( var i = 0; i < this.WORLD_TYPE_LIST.length; i++){
   ELEMS[WORLD_TYPE_LIST[i] + "_CT_DISPLAY"] = document.getElementById(WORLD_TYPE_LIST[i] + "_CT");
   var cancelButton = document.getElementById("button_wf"+WORLD_TYPE_LIST[i]+"Cancel");
   if(cancelButton != null){
       ELEMS[WORLD_TYPE_LIST[i] + "_CT_DISPLAY"].cancelButton = cancelButton;
   }

}

function TICK_updateWorldCounts(){
    for( var i = 0; i < this.WORLD_TYPE_LIST.length; i++){
        var worldType = this.WORLD_TYPE_LIST[i]
        var worldCountLine = fmtSIint(this.INVENTORY["WORLDS-"+WORLD_TYPE_LIST[i]+"-CT"])
        if( this.CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] > 0 ){
          worldCountLine = worldCountLine + " (building: "+fmtSIint(this.CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType])+")"
        }
        if( this.CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] > 0 ){
          worldCountLine = worldCountLine + " (breaking: "+fmtSIint(this.CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType])+")"
        }
        var countDisplay = this.ELEMS[WORLD_TYPE_LIST[i] + "_CT_DISPLAY"]
        if(countDisplay != null){
          countDisplay.innerHTML = worldCountLine
          if(countDisplay.cancelButton != null){
              if(this.CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] > 0 && countDisplay.cancelButton.disabled){
                countDisplay.cancelButton.style.display = "block";
                countDisplay.cancelButton.disabled = false;
              } else if(this.CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] == 0 && (! countDisplay.cancelButton.disabled)) {
                countDisplay.cancelButton.style.display = "none";
                countDisplay.cancelButton.disabled = true;
              }
          }
    
        }
    }
    
    //this.INVENTORY["STARS-" + sinfo[0] +"-CT"]
    
    for( var i=0; i < this.STAR_TYPE_SET.length; i++){
       var sid = this.STAR_TYPE_SET[i].sid;
       var ee = ELEMS["STARCT_"+sid] ;
       var ct = this.INVENTORY["STARS-" + sid +"-CT"];
       var ff = fmtSIintNoPct(ct)
       if(ff != ee.innerHTML){
       
       
         ee.innerHTML = ff;
       }
    }
    
}   
    
function TICK_scoutSystems(){
    var exploreRating = this.STATS["PRODUCTIVITY_RATING"]["scout"] * this.SETTINGS["scout"+"_FRACTION"][0];
    var areaExplored = this.STATS["scout-speed"] * STATS["scout-sensorrange"] * exploreRating;
    var meanDiscovered = areaExplored * this.STATS["explore-starDensity"];
    var varDiscovered = meanDiscovered * 0.25;
    var xx = meanDiscovered + getRandomBetween(-varDiscovered,varDiscovered);
    var xxr = Math.floor(xx);
    var rem = xx - xxr;
    if(Math.random() < rem){
      xxr = xxr + 1;
    }
    this.INVENTORY["WORLDS-Neutral-CT"] = this.INVENTORY["WORLDS-Neutral-CT"] + xxr;


/*
    if(INVENTORY["WORLDS-Neutral-CT"] > 0){
      var oldDisc = INVENTORY["WORLDS-Neutral-CT"]
      var discoverWorlds = STATS["WORLDS-Total-CT"] * ( Math.random()/2500 )
      INVENTORY["WORLDS-Neutral-CT"] = INVENTORY["WORLDS-Neutral-CT"] + discoverWorlds
      var newDiscWorlds = Math.floor(INVENTORY["WORLDS-Neutral-CT"]) - Math.floor(oldDisc)
      STATS["WORLDS-Total-CT"] = STATS["WORLDS-Total-CT"] + discoverWorlds
      //INVENTORY["MATTER-Discovered-CT"] = INVENTORY["MATTER-Discovered-CT"] + newDiscWorlds * STATS["CONVERSIONS"]["gramsPerWorld"]
    }
    if(INVENTORY["WORLDS-Hostile-CT"] > 0){
      var oldDisc = INVENTORY["WORLDS-Hostile-CT"]
      var discoverWorlds = STATS["WORLDS-Total-CT"] * ( Math.random()/2500 )
      INVENTORY["WORLDS-Hostile-CT"] = INVENTORY["WORLDS-Hostile-CT"] + discoverWorlds
      var newDiscWorlds = Math.floor(INVENTORY["WORLDS-Hostile-CT"]) - Math.floor(oldDisc)
      STATS["WORLDS-Total-CT"] = STATS["WORLDS-Total-CT"] + discoverWorlds
      //INVENTORY["MATTER-Discovered-CT"] = INVENTORY["MATTER-Discovered-CT"] + newDiscWorlds * STATS["CONVERSIONS"]["gramsPerWorld"]*
    }*/



}
//MATTER_TYPE_LIST = ["FreeBot","Feedstock","Botbots","Compute","FreeGreen","Digested","Biomass","Waste","Heat","Yogurt"]
//WORLD_TYPE_LIST = ["Fallow","Pop","Omni","Bot","Green","Comp","Hub","Neutral","Hostile","Secure","Slag","Seedres"]

function TICK_INDUSTRY_calcPOWERGEN(){
    var wattMult = this.STATICVAR_HOLDER.WATTAGE_MULTIPLIER
    /*
     * POWER PRODUCTION:
     
        
     */
    var pwrSrc = ["Bot","Bio"];
    var dysonSrc = ["bot","green"]
    var dysonSrcCap = ["Bot","Green"]
    this.INVENTORY["POWER"] = 0;
    for(var z=0; z< pwrSrc.length; z++){
       var pc = pwrSrc[z];
       var dy = dysonSrc[z];
       this.STATS["PRODUCTIVITY_RATING"][pc+"pwrGen"] = this.STATS["PRODUCTIVITY_MULT"][pc+"pwrGen"] * this.STATS["CONVERSIONS"]["pwrFrom"+pc+"pwrPerProdPerTick"] * this.STATS["PRODUCTIVITY_MULT"][dy];
       if(pc == "Bio"){
         this.INVENTORY["POWER-"+pc+"-CAP"] = (this.INVENTORY["MATTER-Biomass-CT"] * this.SETTINGS["BIOMASS_PWR_FRAC"]) * this.STATS["PRODUCTIVITY_RATING"][pc+"pwrGen"] * this.SETTINGS[pc+"_POWERLIMITFRAC"];
       } else {
         this.INVENTORY["POWER-"+pc+"-CAP"] = this.INVENTORY["MATTER-"+pc+"pwr-CT"] * this.STATS["PRODUCTIVITY_RATING"][pc+"pwrGen"] * this.SETTINGS[pc+"_POWERLIMITFRAC"];
       }
       this.INVENTORY["POWER-"+pc+""] = Math.min(this.INVENTORY["POWER-"+pc+"-CAP"] / STATS["ENERGYRATE_MULT"][pc+"pwrGen"],this.INVENTORY["POWER-Free"+dysonSrcCap[z]+"-CT"]) * STATS["ENERGYRATE_MULT"][pc+"pwrGen"];
       
       this.INVENTORY["POWER"] = this.INVENTORY["POWER"] + this.INVENTORY["POWER-"+pc]
       
       var pwrFmt1 = fmtSIunits( Math.round( this.INVENTORY["POWER-"+pc+""]) * wattMult)
       //this.ELEMS[pc+"pwr_POWER_DISPLAY"].unitDisp.innerHTML = pwrFmt1[1];
       
       var pp = ELEMS["POWER_PRODDISPLAY"][pc];
      

      this.INVENTORY["POWERGEN-"+pc+""] = this.INVENTORY["POWER-"+pc+""]
      
      /*
      
              var makeAnonFunc = function(xfid,xfsi){
                //console.log("making anon: ["+xfid+"]");
                return function(){
                  //console.log("setting prodDisplay: ["+xfid+"]");
                  this.GAME.ELEMS[xfid+"_PRODUCTIVITY_DISPLAY"].innerHTML = xfsi[0]+" "+xfsi[1]+this.GAME.PCTSLIDER_DISPLAYUNITS[xfid]
                }
              }
              var anonFunc = makeAnonFunc(fid,fsi)
        window.requestAnimationFrame(anonFunc)
      
      */
      
      var makeAnonFunc2 = function(xpwrFmt1,xpp,xpc){
                return function(){
                  this.GAME.ELEMS[pc+"pwr_POWER_DISPLAY"].innerHTML = xpwrFmt1[0] + xpwrFmt1[1];
                  xpp.powerCAPACITY.innerHTML = xpwrFmt1[0]+xpwrFmt1[1];
                  //STATS["ENERGYRATE_MULT"][ppid+"pwrGen"]
                  xpp.effDisplay.innerHTML = roundTo(100*this.GAME.STATS["ENERGYRATE_MULT"][xpc+"pwrGen"],1)
                  //this.STATS["PRODUCTIVITY_RATING"][pc+"pwrGen"]
                  xpp.prodDisplay.innerHTML = fmtSIflat(this.GAME.STATS["PRODUCTIVITY_RATING"][xpc+"pwrGen"] * this.GAME.STATICVAR_HOLDER.WATTAGE_MULTIPLIER)+"W/t"
                }
      }
      var anonFunc2 = makeAnonFunc2(pwrFmt1,pp,pc)
      window.requestAnimationFrame(anonFunc2)
      
    }
    
    this.INVENTORY["POWERGEN-Hawk"] = 0;
    //console.log("HAWKENER = "+ this.INVENTORY["POWERGEN-Hawk"])
    //this.STATS["PRODUCTIVITY_RATING"]["BiopwrGen"] = this.INVENTORY["MATTER-Biopwr-CT"] * this.STATS["PRODUCTIVITY_MULT"]["BiopwrGen"] * this.STATS["CONVERSIONS"]["pwrFromBiopwrPerProdPerTick"] * this.STATS["PRODUCTIVITY_MULT"]["green"];

    //this.INVENTORY["POWER"] = this.STATS["PRODUCTIVITY_RATING"]["BotpwrGen"] + this.STATS["PRODUCTIVITY_RATING"]["BiopwrGen"]
    this.INVENTORY["POWERGEN"] = this.INVENTORY["POWER"] 
    
}

function TICK_INDUSTRY_addCReqs(){
    //console.log("-------------------")
    for(var i=0; i<this.INDUSTRY_LIST.length; i++){
       var industryID = this.INDUSTRY_LIST[i];
       var iss = this.STATS.INDUSTRY[industryID];
       var productID = iss.productionItem;

       var sliderID = iss.sliderID;
       var sliderIDX = iss.sliderIDX;
       var prod = this.calcIndustrialProd(iss);
       iss.currRequested = prod;
       this.addConstructionRequest(iss.inventoryType+"-"+productID+"-CT",
                                   prod,
                                   this.calcIndustrialCost(iss),
                                   industryID);
    }
    //console.log("-------------------")
}


GAME_GLOBAL.TICK_INDUSTRY_calcPOWERGEN = TICK_INDUSTRY_calcPOWERGEN;
GAME_GLOBAL.TICK_INDUSTRY_addCReqs = TICK_INDUSTRY_addCReqs;




function TICK_calcIndustry(){

    var wattMult = this.STATICVAR_HOLDER.WATTAGE_MULTIPLIER
    //GAME_GLOBAL.INDUSTRY_LIST = ["Feedstock","Botbots","Botpwr","Ship","Compute","Digested","Biopwr","Yogurt","Biomass"]

    //this.executeAllConstructionRequests()

//CONSTRUCTION_REQUESTS.push( [inventoryItemName, requestCt, unitCost, requestCt]

    for(var i=0; i<this.INDUSTRY_LIST.length; i++){
       var industryID = this.INDUSTRY_LIST[i];

       var iss = this.STATS.INDUSTRY[industryID];
       var productID = iss.productionItem ;
       var sd   = iss.sliderID;
       var sdx  = iss.sliderIDX;
       var reqCt = this.STATS["PRODUCTION-REQ"][ industryID ] 
       var currCt = this.STATS["PRODUCTION-CURR"][ industryID ] 
       if(null == this.PCTSLIDERS[sd].displayElem[sdx].PROD){
          console.log("NULL: "+iss.prodTitle);
          console.log("    ["+sd+" / "+sdx+"]");
          
       }
       var limiterString = "";
       var limiterID = this.STATS["LIMIT-REASON"][industryID]
       if( limiterID != ""  ){
          var itemTitle = this.STATICVAR_HOLDER.RESOURCE_INFO[limiterID].itemTitle;
          limiterString = "    (insufficient "+itemTitle+")";
       }
       
       this.PCTSLIDERS[sd].displayElem[sdx].PROD.innerHTML = ( fmtSIflat(currCt)+" / "+fmtSIflat(reqCt) + limiterString)
    }

    var shipBuffer = this.INVENTORY["BUFFER-Ship-CT"];
    for(var i=0; i < this.SHIP_TYPE_LIST.length;i++){
        var shipType = this.SHIP_TYPE_LIST[i];
        this.INVENTORY["SHIPS-"+shipType+"-CT"] = this.INVENTORY["SHIPS-"+shipType+"-CT"] + ((shipBuffer * this.SETTINGS["ship_FRACTION"][i]) / this.STATS["CONVERSIONS"]["bufferPerShip-"+shipType])
        var sd = this.ELEMS["SHIPS-"+shipType+"-DISPLAY"]
        var fmtsi = fmtSIint(this.INVENTORY["SHIPS-"+shipType+"-CT"])
        sd.innerHTML = fmtsi
    }
    this.INVENTORY["SHIP-CONSTRUCT-BUFFER"] = 0;


  //update displays:
   //this["SHIPCONSTRUCTBUFFER_DISPLAY_DIV"].innerHTML = this.INVENTORY["SHIP-CONSTRUCT-BUFFER"]
   
   for( var i = 0; i < this.MATTER_TYPE_LIST.length; i++){
        var matterType = this.MATTER_TYPE_LIST[i]
        var matterCt = this.INVENTORY["MATTER-"+matterType+"-CT"];
        var fmtsi = fmtSIunits(matterCt)
        var sd = this.ELEMS["MATTER-"+matterType+"-DISPLAY"]
        sd.innerHTML = fmtsi[0]
        sd.displayUnits.innerHTML = fmtsi[1]+"t"
        //sd.displayDiv.title = "tons: basic unit of mass\n"+fmtsi[4];

        var sdd = this.ELEMS["MATTERDELTA-"+matterType+"-DISPLAY"]
        if( sdd != null){
            var diff = matterCt - this["INVENTORY-PREVTICK"]["MATTER-"+matterType+"-CT"];
            var sign = "+";
            if(diff < 0){
              diff = -diff
              sign = "-";
            }
            //if(sdd == null){
            //   console.log("sdd null: "+matterType);
            //}
            //if(sdd.displayUnits == null){
            //    console.log("sdd.displayUnits null: "+matterType);
            //}
            var fmtsid = fmtSIunits(diff);
            sdd.innerHTML = sign+fmtsid[0];
            sdd.displayUnits.innerHTML = fmtsid[1]+"t/wk";
        }

    }

    this.CONSTRUCTION_REQUESTS = [];
    

}





function TICK_INDUSTRY_calcScienceGain(){
    for(var i=0;i<this.SCIENCE_TYPES.length;i++){
      var fid = this.SCIENCE_TYPES[i];
      var subf = this.SCIENCE_SUBFIELDS[fid];
      var newSci = this.STATS["PRODUCTIVITY_RATING"][fid] * this.STATS["PRODUCTIVITY_MULT"][fid]
      this.INVENTORY[fid+"_SCIENCE_TOTAL"] = this.INVENTORY[fid+"_SCIENCE_TOTAL"] + newSci
      this.INVENTORY[fid+"_SCIENCE_FREE"] = this.INVENTORY[fid+"_SCIENCE_FREE"] + newSci

      var fsi = fmtSIunits( this.INVENTORY[fid+"_SCIENCE_TOTAL"] );
      this.SCIENCE_DISPLAY[fid].total.innerHTML = fsi[0]+" "+fsi[1]+"B"
      var ffsi = fmtSIunits( this.INVENTORY[fid+"_SCIENCE_FREE"] );
      this.SCIENCE_DISPLAY[fid].total.free.innerHTML = ffsi[0]+" "+ffsi[1]+"B"

      for(var j=0;j<subf;j++){
        var newSubSci = this.STATS["PRODUCTIVITY_RATING"][fid] * this.STATS["PRODUCTIVITY_MULT"][fid] * this.SETTINGS[fid+"_FRACTION"][j];
        this.INVENTORY[fid+j+"_SCIENCE_TOTAL"] = this.INVENTORY[fid+j+"_SCIENCE_TOTAL"] + newSubSci
        this.INVENTORY[fid+j+"_SCIENCE_FREE"]  = this.INVENTORY[fid+j+"_SCIENCE_FREE"]  + newSubSci
        var fssi = fmtSIunits( this.INVENTORY[fid+j+"_SCIENCE_TOTAL"] );
        this.SCIENCE_DISPLAY[fid][j].innerHTML =  fssi[0]+" "+fssi[1]+"B"
        var ffssi = fmtSIunits( this.INVENTORY[fid+j+"_SCIENCE_FREE"] );
        this.SCIENCE_DISPLAY[fid][j].free.innerHTML =  ffssi[0]+" "+ffssi[1]+"B"
      }
    }


    for(var i=0; i<this.RESEARCH_BUTTONS.length; i++){
        this.RESEARCH_BUTTONS[i].canAffordTest()
    }
}

    /*
     POWER USAGE:
    */

function TICK_INDUSTRY_calcPowerUsage(){
    var wattMult = this.STATICVAR_HOLDER.WATTAGE_MULTIPLIER

       //var pwrFmt5 = fmtSIunits( Math.round(this.INVENTORY["POWERGEN"]) * wattMult )
       //var pwrFmt3 = fmtSIunits( Math.round(this.INVENTORY["POWER"]) * wattMult )
       //var pwrFmt4 = fmtSIunits( Math.round((this.INVENTORY["POWERGEN"] - this.INVENTORY["POWER"]))* wattMult )
       //var pwrFmt6 = fmtSIunits( Math.round(this.STATS["CURR_POWER_DEMAND"]) * wattMult )
       //this.ELEMS["POWER_DISPLAY"].unitDisp.innerHTML = pwrFmt5[1];
       //this.ELEMS["SURPLUS_POWER_DISPLAY"].unitDisp.innerHTML = pwrFmt3[1];
       //this.ELEMS["USAGE_POWER_DISPLAY"].unitDisp.innerHTML = pwrFmt4[1];
       //this.ELEMS["DEMAND_POWER_DISPLAY"].unitDisp.innerHTML = pwrFmt6[1];

    var pwrFmt3 = fmtSIflat( Math.round(this.INVENTORY["POWER"]) * wattMult )
    var pwrFmt4 = fmtSIflat( Math.round((this.INVENTORY["POWERGEN"] - this.INVENTORY["POWER"]))* wattMult )
    var pwrFmt5 = fmtSIflat( Math.round(this.INVENTORY["POWERGEN"]) * wattMult )
    var pwrFmt6 = fmtSIflat( Math.round(this.STATS["CURR_POWER_DEMAND"]) * wattMult )

    //console.log(pwrFmt3 +"/"+pwrFmt4+"/"+pwrFmt5+"/"+pwrFmt6);
    var makeAnonFunc = function(xpwrFmt3,xpwrFmt4, xpwrFmt5, xpwrFmt6){
                return function(){
                    //console.log(xpwrFmt3 +"/"+xpwrFmt4+"/"+xpwrFmt5+"/"+xpwrFmt6);
                    this.GAME.ELEMS["SURPLUS_POWER_DISPLAY"].innerHTML = xpwrFmt3;
                    this.GAME.ELEMS["USAGE_POWER_DISPLAY"].innerHTML = xpwrFmt4;
                    this.GAME.ELEMS["POWER_DISPLAY"].innerHTML = xpwrFmt5;
                    this.GAME.ELEMS["DEMAND_POWER_DISPLAY"].innerHTML = xpwrFmt6;
                    //console.log(this.GAME.ELEMS["DEMAND_POWER_DISPLAY"].innerHTML);
                }
    }
    var anonFunc = makeAnonFunc(pwrFmt3,pwrFmt4,pwrFmt5,pwrFmt6);
    window.requestAnimationFrame(anonFunc);
    
    var pwrUsage = this.INVENTORY["POWERGEN"] - this.INVENTORY["POWER"];
    var pwrUsageLeft = pwrUsage;
    var thermalPwr = 0;
    
    //console.log("HAWKENER = "+ this.INVENTORY["POWERGEN-Hawk"])
    //TODO: sort by priority!
    for(var i=0; i < this.STATICVAR_HOLDER.POWER_SOURCE_LIST.length; i++){
      var ppid = this.STATICVAR_HOLDER.POWER_SOURCE_LIST[i];
      var pp = ELEMS["POWER_PRODDISPLAY"][ppid];
      var worldType = pp.powerWorld
      var genCapacity = this.INVENTORY["POWERGEN-"+ppid+""]
      var worldPwrUsage = genCapacity;
      //console.log("["+ppid+"]"+"genCapacity:"+genCapacity +", pwrUsageLeft:"+pwrUsageLeft +", worldPwrUsage:"+worldPwrUsage);
      if(genCapacity < pwrUsageLeft){
        pwrUsageLeft = pwrUsageLeft - genCapacity
      } else {
        //pwrUsageLeft = 0;
        worldPwrUsage = pwrUsageLeft;
        pwrUsageLeft = 0;
      }
      var worldPowerCollected = worldPwrUsage / STATS["ENERGYRATE_MULT"][ppid+"pwrGen"];
      thermalPwr = thermalPwr + this.INVENTORY["POWER-Free"+worldType+"-CT"];
      var makeAnonFunc2 = function(){
                    var wpAvail = fmtSIflat( Math.round( this.INVENTORY["POWER-Free"+worldType+"-CT"]) * wattMult )
                    var wpThermal = fmtSIflat( Math.round( this.INVENTORY["POWER-Free"+worldType+"-CT"]) * wattMult )
                    var wpCollect = fmtSIflat( Math.round( worldPowerCollected ) * wattMult )
                    var wpOutput = fmtSIflat( Math.round( worldPwrUsage ) * wattMult )
                    var xpp = pp;
                    return function(){
                      xpp.powerAVAIL.innerHTML   = wpAvail;
                      xpp.powerTHERMAL.innerHTML = wpThermal;
                      xpp.powerCOLLECT.innerHTML = wpCollect;
                      xpp.powerOUTPUT.innerHTML  = wpOutput;
                    }
      }
      var anonFunc2 = makeAnonFunc2();
      window.requestAnimationFrame(anonFunc2);
      this.INVENTORY["MATTER-Free"+worldType+"-CT"] = this.INVENTORY["MATTER-Free"+worldType+"-CT"] - this.INVENTORY["POWER-Free"+worldType+"-CT"] * this.STATICVAR_HOLDER.MASS_PER_POWERTICK
      
      /*
      pp.powerAVAIL.innerHTML   = fmtSIflat( Math.round( this.INVENTORY["POWER-Free"+worldType+"-CT"]) * wattMult );
      pp.powerTHERMAL.innerHTML = fmtSIflat( Math.round( this.INVENTORY["POWER-Free"+worldType+"-CT"]) * wattMult );
      //console.log("worldPwrUsage["+ppid+"] = "+worldPwrUsage)
      //console.log("genCapacity["+ppid+"] = "+genCapacity)
      //console.log("INVENTORYCAP["+ppid+"] = "+this.INVENTORY["POWERGEN-"+pc+""])
      pp.powerCOLLECT.innerHTML = fmtSIflat( Math.round( worldPowerCollected ) * wattMult );
      pp.powerOUTPUT.innerHTML = fmtSIflat( Math.round( worldPwrUsage ) * wattMult );
      */
    }
    var thermalMass = thermalPwr * this.STATICVAR_HOLDER.MASS_PER_POWERTICK
    this.INVENTORY["MATTER-Heat-CT"] = this.INVENTORY["MATTER-Heat-CT"] + thermalMass
    
      /*var makeAnonFunc2 = function(){
                    var thermalString = fmtSIflat(thermalPwr * wattMult);
                    return function(){
                      INVENTORY
                    }
      }
      var anonFunc2 = makeAnonFunc3();
      window.requestAnimationFrame(anonFunc3);    */

}

GAME_GLOBAL.TICK_INDUSTRY_calcPowerUsage = TICK_INDUSTRY_calcPowerUsage;
GAME_GLOBAL.TICK_INDUSTRY_calcScienceGain = TICK_INDUSTRY_calcScienceGain;


console.log("[all science] is lvl "+(1) + ", next threshold: "+fmtSIintNoPct(Math.pow( this.SCIENCE_UNLOCK_THRESH_MULT, (2)) * this.SCIENCE_UNLOCK_THRESH_BASE));

GAME_GLOBAL.SCIENCE_SCALED_UNLOCK_RATE = 1.0;

function TICK_calcScience(){
    for(var i=0;i<this.SCIENCE_TYPES.length;i++){
      var sciname = this.SCIENCE_TYPES[i];
      //var subf = SCIENCE_SUBFIELDS[scienceName];
      var currLvl = this.INVENTORY["SCIENCE-LEVEL-"+sciname];
      var currSci = this.INVENTORY[sciname+"_SCIENCE_TOTAL"] + this.INVENTORY["DEEP_SCIENCE_TOTAL"]
      if( Math.pow( this.SCIENCE_UNLOCK_THRESH_MULT, (currLvl + 1)) * this.SCIENCE_UNLOCK_THRESH_BASE < currSci ){
         console.log("["+sciname+"] is lvl "+(currLvl + 1) + ", next threshold: "+fmtSIintNoPct(Math.pow( this.SCIENCE_UNLOCK_THRESH_MULT, (currLvl + 2)) * this.SCIENCE_UNLOCK_THRESH_BASE));
         INVENTORY["SCIENCE-LEVEL-"+sciname] = INVENTORY["SCIENCE-LEVEL-"+sciname] + 1;
         
         if( Math.random() < this.SCIENCE_UNLOCK_RATE ){
           console.log("   attempting unlock");
           var projectList   = this.STATICVAR_HOLDER.SCIENCE.MULTI[sciname];
           var projectCts    = this.STATS.SCIENCE_MULTICT;
           var idx = Math.floor( getRandomBetween(0,projectList.length) );
           console.log("   attempting unlock: "+ projectList[idx].projectID);
           if(Math.random() < projectList[idx].rate){
              console.log("   unlocking: "+ projectList[idx].projectID);
              //     var ap1 = availListElem.addMultiProject(projectList[idx1],1,1)
              this.SCIENCE_DISPLAY[sciname].availListElem.addMultiProject(projectList[idx], currLvl + 1)
           }
         } else if(Math.random() < GAME_GLOBAL.SCIENCE_SCALED_UNLOCK_RATE){
           console.log("   attempting unlock");
           var projectList   = this.STATICVAR_HOLDER.SCIENCE.SCALED[sciname];
           var projectLocked = STATS.SCIENCE_LOCKED["SCALED"][sciname];
           if(projectLocked.length > 0){
             var idxidx = Math.floor( getRandomBetween(0,projectLocked.length) );
             var idx = projectLocked[idxidx];
             console.log("   attempting SCALED unlock: "+ projectList[idx].projectID);
             if(Math.random() < projectList[idx].rate){
                this.SCIENCE_DISPLAY[sciname].availListElem.addScaledProject(projectList[idx], currLvl + 1)
             }
           }
         } else {
           console.log("   skipping unlock");
         }
         //do the unlocks:getRandomBetween
         
      }
    }

}



function TICK_calcWar(){

/*
    var captureNeutral = INVENTORY["WORLDS-Neutral-CT"] * (Math.random()/3000)
    var captureHostile = INVENTORY["WORLDS-Hostile-CT"] * (Math.random()/3000)
    INVENTORY["WORLDS-Hostile-CT"] = INVENTORY["WORLDS-Hostile-CT"] - captureHostile
    INVENTORY["WORLDS-Neutral-CT"] = INVENTORY["WORLDS-Neutral-CT"] - captureNeutral
    INVENTORY["WORLDS-Secure-CT"]  = INVENTORY["WORLDS-Secure-CT"]  + captureHostile + captureNeutral*/
}

function TICK_captureSystems(){

    /*
    STATS["seedship-speed"] = 0.001;
    STATS["seedship-toughness"] = 1;

    STATS["seedship-Secure-seedRate"] = 0.95;
    STATS["seedship-Neutral-seedRate"] = 0.75;
    STATS["seedship-Hostile-seedRate"] = 0.05;

    INVENTORY["seedship-transit-buffer"] = [];
    INVENTORY["seedship-transit-CT"] = 0;


    STATS["seedship-distToNextStar"] = 1.219;
    */

    var ssct = Math.min( Math.floor(this.INVENTORY["SHIPS-"+"seedship"+"-CT"]), this.INVENTORY["WORLDS-Neutral-CT"]-this.INVENTORY["seedship-transit-CT"] );


    if(ssct > 0){
      var arriveTime = ( this.STATS["seedship-distToNextStar"] / this.STATS["seedship-speed"] ) + this.STATS["TICK"]
      this.INVENTORY["seedship-transit-CT"] = this.INVENTORY["seedship-transit-CT"] + ssct;
      this.INVENTORY["seedship-transit-buffer"].push([ssct,arriveTime]);
      this.INVENTORY["SHIPS-"+"seedship"+"-CT"] = this.INVENTORY["SHIPS-"+"seedship"+"-CT"] - ssct;
    }
    var landct = 0;
    while(this.INVENTORY["seedship-transit-buffer"].length > 0 && this.INVENTORY["seedship-transit-buffer"][0][1] <= this.STATS["TICK"]){
      landct = landct + this.INVENTORY["seedship-transit-buffer"].shift()[0];
    }
    this.INVENTORY["WORLDS-Fallow-CT"] = this.INVENTORY["WORLDS-Fallow-CT"] + landct;
    this.INVENTORY["seedship-transit-CT"] = this.INVENTORY["seedship-transit-CT"] - landct;
    this.INVENTORY["WORLDS-Neutral-CT"] = this.INVENTORY["WORLDS-Neutral-CT"] - landct;

    this.seedshipsInTransit_SPAN.innerHTML = fmtSIintNoPct(this.INVENTORY["seedship-transit-CT"]);
    if(this.INVENTORY["seedship-transit-buffer"].length > 0){
       this.timeToNextLanding_SPAN.innerHTML = this.getTimeStringFromTick(this.INVENTORY["seedship-transit-buffer"][0][1] - this.STATS["TICK"])
    } else {
       this.timeToNextLanding_SPAN.innerHTML = "N/A"
    }

    /*Fallow
                <span id="seedshipsInTransit_HOLDER"><span class="INFO_TEXT_STATIC">In-transit: </span> <span id="seedshipsInTransit_SPAN"></span></span>
            <span id="timeToNextLanding_HOLDER"><span class="INFO_TEXT_STATIC">Time to next landing: </span> <span id="timeToNextLanding_SPAN"></span></span>

        var seedCapture = ( INVENTORY["WORLDS-Secure-CT"] * ( 1 + Math.random()/2500 ))
        seedCapture = Math.min( INVENTORY["WORLDS-Secure-CT"], seedCapture )
        INVENTORY["WORLDS-Fallow-CT"] = INVENTORY["WORLDS-Fallow-CT"] + seedCapture
        INVENTORY["WORLDS-Secure-CT"] = INVENTORY["WORLDS-Secure-CT"] - seedCapture
    */
    /*
     NOTE: later on, allow capture of neutral systems, with risk to the seedship.
    */
}

function buildFromCost(itemId, itemCt,itemCost){
  var buildLimit = Math.abs( itemCt );
  for(var i=0;i<itemCost.length;i++){
    var cc = itemCost[i];
    if(cc[1] > 0){
      buildLimit = Math.min( Math.floor( this.INVENTORY[ cc[0] ] / cc[1] ), buildLimit);
    }
  }
  for(var i=0;i<itemCost.length;i++){
    var cc = itemCost[i];
    this.INVENTORY[ cc[0] ] = this.INVENTORY[ cc[0] ] - (buildLimit*cc[1]);
  }
  if(itemCt < 0){
    this.INVENTORY[itemId] = this.INVENTORY[itemId] - buildLimit
  } else {
    this.INVENTORY[itemId] = this.INVENTORY[itemId] + buildLimit
  }
  return buildLimit;
}

function TICK_constructWorlds(){

  for(var i=0;i<this.DYSON_TYPE_LIST.length;i++){
    var worldType = this.DYSON_TYPE_LIST[i]
    //if( this.CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType] == null){
      //console.log("null found: i="+i+", "+this.DYSON_TYPE_LIST[i]);
    //}
    if(this.CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType].length > 0){
      if(  this.CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType][0][1] < Date.now() ){
        var nxtAttempt = this.CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType][0][0]
        var nxt = this.buildFromCost("WORLDS-"+worldType+"-CT",nxtAttempt,this.STATS["COST-WORLDBUILD-"+worldType]);
        
        var starInfo = this.STAR_TYPE_SET.getRandStarBatch(nxt,0.5)
        
        for( var z=0; z < starInfo[1].length; z++){
          var sinfo = starInfo[1][z];
          this.INVENTORY["STARS-" + sinfo[0] +"-CT"] = this.INVENTORY["STARS-" + sinfo[0] +"-CT"] + sinfo[1];
        }
        this.INVENTORY["MATTER-Free"+worldType+"-CT"] = this.INVENTORY["MATTER-Free"+worldType+"-CT"] + (starInfo[2] * this.STATICVAR_HOLDER.SOLAR_MASS);
        this.INVENTORY["POWER-Free"+worldType+"-CT"] = this.INVENTORY["POWER-Free"+worldType+"-CT"] + (starInfo[3] * this.STATICVAR_HOLDER.WATTAGE_SOL_LUMINOSITY);
        
        if(nxt == nxtAttempt){
          var nxtbuf = this.CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType].shift()
        } else {
          this.CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType][0][0] = this.CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType][0][0] - nxt;
        }
        this.CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] = this.CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] - nxt
      }
    }
    if(this.CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType].length > 0){
      if(  this.CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType][0][1] < Date.now() ){
        var nxtAttempt = this.CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType][0][0]
        var nxt = this.buildFromCost("WORLDS-"+worldType+"-CT",-nxtAttempt,this.STATS["COST-WORLDDECON-"+worldType]);
        if(nxt == nxtAttempt){
          var nxtbuf = this.CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType].shift()
        } else {
          this.CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType][0][1] = this.CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType][0][1] - nxt;
        }
        this.CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] = this.CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] - nxt
      }
    }
  }
}






//MATTER-FreeBot-CT
//MATTER-FreeGreen-CT


GAME_GLOBAL.TICK_readUserInputs = TICK_readUserInputs;
GAME_GLOBAL.TICK_setUserInputs = TICK_setUserInputs;
GAME_GLOBAL.TICK_updateStats = TICK_updateStats;
GAME_GLOBAL.addConstructionRequest = addConstructionRequest;
GAME_GLOBAL.executeAllConstructionRequests = executeAllConstructionRequests;
GAME_GLOBAL.TICK_scoutSystems=TICK_scoutSystems;
GAME_GLOBAL.TICK_calcIndustry=TICK_calcIndustry;

GAME_GLOBAL.TICK_updateWorldCounts=TICK_updateWorldCounts;

GAME_GLOBAL.TICK_constructWorlds = TICK_constructWorlds;

GAME_GLOBAL.TICK_calcWar = TICK_calcWar;
GAME_GLOBAL.TICK_captureSystems = TICK_captureSystems;
GAME_GLOBAL.buildFromCost = buildFromCost;


GAME_GLOBAL.getTimeStringFromTick = getTimeStringFromTick
GAME_GLOBAL.getDateStringFromTick = getDateStringFromTick;


