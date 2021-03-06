


///////////////////////////////

function canAfford(c){
   for(var i=0; i<c.length;i++){
      if( this.INVENTORY[ c[i][0] ] < c[i][1] ){
         return false;
      }
   }
   return true;
}
GAME_GLOBAL.canAfford = canAfford

function makeCostAbbriv(cc,delim){
   var ccc = fmtSIunits(cc[0][1]);
   var costString = ccc[0] + ccc[1] +"B "+ STATICVAR_HOLDER["INVENTORY_DESC_ABBRIV"][cc[0][0]];
   if(cc.length > 1){
     for(var i=1; i<cc.length;i++){
       var c3 = fmtSIunits(cc[i][1]);
       costString = costString + delim + c3[0] + c3[1] +"B "+ STATICVAR_HOLDER["INVENTORY_DESC_ABBRIV"][cc[i][0]];
     }
   }
   return costString;
}
GAME_GLOBAL.makeCostAbbriv = makeCostAbbriv


///////////////////////////////
////Initialize starting stats


for(var i=0;i<SCIENCE_TYPES.length;i++){
  var scienceName = SCIENCE_TYPES[i];
  var subf = SCIENCE_SUBFIELDS[scienceName];
  SCIENCE_DISPLAY[scienceName] = [];
  SCIENCE_DISPLAY[scienceName].total = document.getElementById(scienceName+"_TOTAL_DISPLAY");
    if(SCIENCE_DISPLAY[scienceName].total == null){
       console.log(scienceName+": is null");
    }
  SCIENCE_DISPLAY[scienceName].total.unitDisplay = document.getElementById(scienceName+"_TOTAL_DISPLAY_UNITS");
  SCIENCE_DISPLAY[scienceName].total.free = document.getElementById(scienceName+"_FREE_DISPLAY");
  INVENTORY[scienceName+"_SCIENCE_TOTAL"] = 0
  INVENTORY[scienceName+"_SCIENCE_FREE"] = 0

  for(var j=0;j<subf;j++){
    SCIENCE_DISPLAY[scienceName][j]      = document.getElementById(scienceName+(j+1)+"_TOTAL_DISPLAY");
    SCIENCE_DISPLAY[scienceName][j].free = document.getElementById(scienceName+(j+1)+"_FREE_DISPLAY");
    if(SCIENCE_DISPLAY[scienceName][j] == null){
       console.log(scienceName+j+": is null");
    }
    SCIENCE_DISPLAY[scienceName][j].unitDisplay = document.getElementById(scienceName+(j+1)+"_TOTAL_DISPLAY_UNITS");
    INVENTORY[scienceName+j+"_SCIENCE_TOTAL"] = 0
    INVENTORY[scienceName+j+"_SCIENCE_FREE"] = 0
  }
}
INVENTORY["DEEP"+"_SCIENCE_TOTAL"]  = 0
INVENTORY["SUPER"+"_SCIENCE_TOTAL"] = 0



//Productivity: <span id="green_PRODUCTIVITY_DISPLAY"></span>


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PERCENT SLIDERS:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//PRODUCTIVITY_STATS = ["bot","psy","green","bio","eng","psy","think","soul"]
//STATS["PRODUCTIVITY_RATING"] = {}
//STATS["PRODUCTIVITY_MULT"] = {}

//function fmtSIunits(x){
//Returns [0]baseNumber, [1]prefixAbbrev, [2]prefixFull, [3]prefixExponent, [4]a string of prefix descriptions



function updatePctSliderDisplayHelper_OLD(ss){
  var fid = ss.fid;
  var vv = ss.value
  var tt = (vv / 10000) * this.STATS["PRODUCTIVITY_RATING"][fid] * this.STATS["PRODUCTIVITY_MULT"][fid]
  var fmtsi = fmtSIunits(tt)
  ss.sdisplay.innerHTML = (vv / 100).toFixed(1) + "% ["+fmtsi[0]
  ss.sdisplayUnits.innerHTML = fmtsi[1]+this.PCTSLIDER_DISPLAYUNITS[fid]+"]"
  ss.sdisplayDiv.title = this.STATICVAR_HOLDER.PCTSLIDER_DISPLAYUNITSEXPLAIN[fid]+"\n"+fmtsi[4]
}

function updatePctSliderDisplayHelper(ss){
      var makeAnonFunc = function(){
                  var fid = ss.fid;
                  var vv = ss.value
                  var tt = (vv / 10000) * this.STATS["PRODUCTIVITY_RATING"][fid] * this.STATS["PRODUCTIVITY_MULT"][fid]
                  var fmtsi = fmtSIflat(tt / this.STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR)
                  return function(){
                      ss.sdisplay.innerHTML = (vv / 100).toFixed(1) + "% ["+fmtsi+this.PCTSLIDER_DISPLAYUNITS[fid]+"]";
                  }
      }
      var anonFunc = makeAnonFunc();
      window.requestAnimationFrame(anonFunc);
      
}

//this.STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR

function updatePctSliderDisplay(ss){
  var fid = ss.fid;
  for(var j = 0; j < ss.othrArray.length; j++){
    this.updatePctSliderDisplayHelper(ss.othrArray[j])
  }
  this.updatePctSliderDisplayHelper(ss)
  //PCTSLIDER_DISPLAYUNITS[fid]+"]"
}

GAME_GLOBAL.updatePctSliderDisplay=updatePctSliderDisplay;
GAME_GLOBAL.updatePctSliderDisplayHelper=updatePctSliderDisplayHelper;




function onInputMultiSliderPct(ss){
      var cval = parseFloat(ss.value)
      if(ss.ktotal + cval >= 10000){
        ss.value = 10000 - ss.ktotal
        for(var j = 0; j < ss.othrArray.length; j++){
          if(ss.othrArray[j].lockbox.checked == false){
                ss.othrArray[j].value = 0
          }
        }
      } else if(ss.ktotal + cval < 10000 && ss.stotal == 0) {
        ss.value = 10000 - ss.ktotal
        for(var j = 0; j < ss.othrArray.length; j++){
          if(ss.othrArray[j].lockbox.checked == false){
            ss.othrArray[j].value = 1
          }
        }
        onDownMultiSliderPct(ss)
      } else {
        var othrVal = 10000 - ss.ktotal - cval
        for(var j = 0; j < ss.othrArray.length; j++){
          if(ss.othrArray[j].lockbox.checked == false){
            ss.othrArray[j].value = ss.ssf[j] * othrVal
          }
        }
      }
      this.GAME.updatePctSliderDisplay(ss)
}

function onDownMultiSliderPct(ss){
      //output.innerHTML = "DOWN"
      ss.stotal = 0
      ss.ktotal = 0
      ss.downval = parseFloat(ss.value);
      for(var j = 0; j < ss.othrArray.length; j++){
        if(ss.othrArray[j].lockbox.checked == true){
          ss.ssf[j] = parseFloat(ss.othrArray[j].value);
          ss.ktotal = ss.ktotal + ss.ssf[j]
        } else {
          ss.ssf[j] = parseFloat(ss.othrArray[j].value);
          ss.stotal = ss.stotal + ss.ssf[j]
        }
      }
      for(var j = 0; j < ss.othrArray.length; j++){
        ss.ssf[j] = ss.ssf[j] / ss.stotal
      }
}

//var output = document.getElementById("bioSliderPctVal");
//output.innerHTML = 10;



for(var sfi = 0; sfi < PCTSLIDER_FIELDS.length; sfi++){
    var fid = PCTSLIDER_FIELDS[sfi]
    var fct = PCTSLIDER_SUBFIELDCT[sfi]
    var check_elem = []
    var display_elem = []
    var displayUnits_elem = []
    var displayDiv_elem = []
    var slider_elem = []
    for(var i = 0; i < fct; i++){
         STATS["PRODUCTIVITY_MULT"][fid+"_"+i] = 1;
         STATS["WASTERATE_MULT"][fid+"_"+i] = 1;
         STATS["ENERGYRATE_MULT"][fid+"_"+i] = 1;
         //console.log("1: "+fid+"SliderCheck"+(i+1))
         slider_elem[i] = document.getElementById(fid+"SliderPct"+(i+1));
         check_elem[i] = document.getElementById(fid+"SliderCheck"+(i+1));
         display_elem[i] = document.getElementById(fid+"SliderDisplayPct"+(i+1));
         displayUnits_elem[i] = document.getElementById(fid+"SliderDisplayPct"+(i+1)+"_UNITS");
         displayDiv_elem[i] = document.getElementById(fid+"SliderDisplayPct"+(i+1)+"_DIV");
         display_elem[i].PROD = document.getElementById(fid+"SliderDisplayPct"+(i+1)+"_PROD");
         slider_elem[i].IS_LOCKED = false
         slider_elem[i].GAME = GAME_GLOBAL
         //console.log("2: "+fid+"SliderCheck"+(i+1))
    }
    PCTSLIDERS[fid] = {checkElem: check_elem, displayElem: display_elem, sliderElem:slider_elem}
    for(var i = 0; i < fct; i++){
        STATS["PRODUCTIVITY_RATING"][fid]
        var ss = slider_elem[i];
        ss.sdisplay = display_elem[i]
        ss.sdisplayUnits = displayUnits_elem[i]
        ss.sdisplayDiv = displayDiv_elem[i]
        ss.othrArray = slider_elem.slice()
        ss.othrArray.splice(i,1)
        ss.lockbox = check_elem[i]
        ss.fid = fid;
        ss.ssf = []
        ss.stotal = 0
        ss.GAME = GAME_GLOBAL;
        ss.onInputMultiSliderPct = onInputMultiSliderPct;
        ss.onDownMultiSliderPct = onDownMultiSliderPct;

        ss.onmousedown = function() {
          this.onDownMultiSliderPct(this)
        }
        ss.ontouchstart = function() {
          this.onDownMultiSliderPct(this)
        }
        //ss.onmouseup = function() {
          //output.innerHTML = "UP"
        //}
        ss.oninput = function() {
          this.onInputMultiSliderPct(this)
        }
        ss.onchange = function() {
          this.onInputMultiSliderPct(this)
        }
    }
    onDownMultiSliderPct(slider_elem[0])
    GAME_GLOBAL.updatePctSliderDisplay(slider_elem[0])
    if(document.getElementById(fid+"_PRODUCTIVITY_DISPLAY") != null){
      document.getElementById(fid+"_PRODUCTIVITY_DISPLAY").innerHTML = fmtSI( STATS["PRODUCTIVITY_RATING"][fid] * STATS["PRODUCTIVITY_MULT"][fid])+PCTSLIDER_DISPLAYUNITS[fid]
    }
}




function powerLimiterInput(){
   var d = this.displayElem;
   d.innerHTML = roundTo(parseFloat(this.value) / 100,1) + "%"
}

for(var i=0; i < STATICVAR_HOLDER.POWER_SOURCEWORLD_LIST.length; i++){
  var worldType = STATICVAR_HOLDER.POWER_SOURCEWORLD_LIST[i];
  var ppid = STATICVAR_HOLDER.POWER_SOURCE_LIST[i]
  
  ELEMS[worldType+"PowerLimiter"].onchangeFcn = powerLimiterInput
  ELEMS[worldType+"PowerLimiter"].oninput = powerLimiterInput
  ELEMS[worldType+"PowerLimiter"].onchange = powerLimiterInput
  ELEMS[worldType+"PowerLimiter"].onchangeFcn()
}

for( var i = 0; i < SHIP_TYPE_LIST.length; i++){
  var shipType = SHIP_TYPE_LIST[i];
  INVENTORY["SHIPS-"+shipType+"-CT"] = 0;
  var disp = document.getElementById("RESOURCE_DISPLAY_SHIPS_"+shipType)
  ELEMS["SHIPS-"+shipType+"-DISPLAY"] = disp;
  disp.shipType = shipType;
  disp.displayUnits = document.getElementById(shipType+"_SHIPS_UNITS")
  disp.displayDiv = document.getElementById(shipType+"_SHIPS_DIV")
}
//      <div class="contentGridItem1x1 contentGridItem"><div class="valueDisplayDiv" id="Ships_MATTER_DIV">   <span class="INFO_TEXT_STATIC">Starships:</span><br><span id="RESOURCE_DISPLAY_MATTER_Ships">0.0</span> <span id="Ships_MATTER_UNITS">g</span></div></div>


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MATTER:

/*MATTER_TYPE_LIST = ["Discovered","Available","Collected","Processed","Waste","Heat","Yogurt"]*/


/*INVENTORY["MATTER"]={}*/
for( var i = 0; i < MATTER_TYPE_LIST.length; i++){

   var matterType = MATTER_TYPE_LIST[i]
      console.log("matter:"+matterType)
   INVENTORY["MATTER-"+matterType+"-CT"] = 0
   var matterDisplay = document.getElementById("RESOURCE_DISPLAY_MATTER_"+matterType)
   var matterDeltaDisplay = document.getElementById("RESOURCE_DISPLAY_MATTERDELTA_"+matterType)


   ELEMS["MATTER-"+matterType+"-DISPLAY"] = matterDisplay
   matterDisplay.matterType = matterType
   matterDisplay.displayUnits = document.getElementById(matterType+"_MATTER_UNITS")
   matterDisplay.displayDiv = document.getElementById(matterType+"_MATTER_DIV")
   if(matterDeltaDisplay != null){
   ELEMS["MATTERDELTA-"+matterType+"-DISPLAY"] = matterDeltaDisplay;
   matterDeltaDisplay.displayUnits = document.getElementById(matterType+"_MATTERDELTA_UNITS")
   matterDeltaDisplay.displayDiv = document.getElementById(matterType+"_MATTERDELTA_DIV")
   } else {
     console.log("matterDeltaDisplay null:"+matterType);
   }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tabs:


var tabHolderList = document.getElementsByClassName("tabHolder")
var tabSetSet = [];
var tabSetNames = [];

for(var i=0; i<tabHolderList.length; i++){
   var xx = tabHolderList[i].id.split("_");
   var xn = xx[0]
   var xv = parseInt(xx[1])
   var elem = tabHolderList[i];
   if(tabSetSet[xn] == null){
     var xobj = {};
     xobj.tabID = xx[0];
     tabHolderList[i].tabHolder = xobj;
     xobj.tabElem = [elem];
     xobj.tabCt = xv;
     tabSetSet[xn] = xobj
     tabSetNames.push(xn);
     elem.contentDiv = document.getElementById(xn+"_CONTENT_"+xv);
   } else {
     var xobj = tabSetSet[xn];
     tabHolderList[i].tabHolder = xobj;
     xobj.tabElem.push(tabHolderList[i]);
     xobj.tabCt = Math.max(xobj.tabCt,xv);
     elem.contentDiv = document.getElementById(xn+"_CONTENT_"+xv);
   }
}

for(var i=0; i<tabSetNames.length; i++){
   var xn = tabSetNames[i];
   for(var j=0; j<tabSetSet[xn].tabCt;j++){
     tabSetSet[xn].tabElem[j].onclick = function(){
       for(var k=0; k<this.tabHolder.tabCt; k++){
          this.tabHolder.tabElem[k].classList.remove("selectedTab");
          this.tabHolder.tabElem[k].contentDiv.style.display = "none";
       }
       this.classList.add("selectedTab")
       this.contentDiv.style.display = "block"
     }
   }
}



for(var i=0; i< SCIENCE_TYPES.length; i++){
   //PROJECTSAVAIL_LIST_bio
   //CURRENT_AVAIL_PROJECT_DESC_bio
   //RESEARCH_CURRENT_PROJECT_bio
   var fid = SCIENCE_TYPES[i];
   var availListElem = document.getElementById("PROJECTSAVAIL_LIST_"+fid);
   var descElem = document.getElementById("CURRENT_AVAIL_PROJECT_DESC_"+fid);
   var researchButton = document.getElementById("RESEARCH_CURRENT_PROJECT_"+fid);
   availListElem.fid = fid;
   availListElem.addMultiProject = addMultiProject
   availListElem.addScaledProject = addScaledProject

   availListElem.descElem = descElem;
   availListElem.researchButton = researchButton;
   availListElem.GAME = GAME_GLOBAL;
   researchButton.fid = fid;
   researchButton.availListElem = availListElem;
   researchButton.GAME = GAME_GLOBAL;
   //researchButton.canAfford = canAfford;
   //researchButton.INVENTORY = INVENTORY;
   RESEARCH_BUTTONS.push(researchButton);

   SCIENCE_DISPLAY[fid].availListElem = availListElem;

   availListElem.addNewProject = function(pp){
     this.GAME.STATS["AVAIL_PROJECTS"][this.fid][pp.uid] = pp;
     var elem = document.createElement("option");
     pp.listElem = elem;
     elem.value = pp.uid;
     elem.appendChild( document.createTextNode( pp.projectTitle ) );
     this.appendChild(elem);
   }
   /*for(var j=0; j < STATS["UNLOCK_PROJECTS"][fid].length; j++){
     var pp = STATS["UNLOCK_PROJECTS"][fid][j];
     STATS["AVAIL_PROJECT_LIST"][fid].push(pp.projectID);
     STATS["AVAIL_PROJECTS"][fid][pp.projectID] = pp;
     var elem = document.createElement("option");
     pp.listElem = elem;
     elem.value = pp.projectID;
     elem.appendChild( document.createTextNode( pp.projectTitle ) );
     availListElem.appendChild(elem);
   }*/

   researchButton.canAffordTest = function(){
       var vv = this.availListElem.value;
       var pp = this.GAME.STATS["AVAIL_PROJECTS"][this.fid][vv];
       if(pp != null){
         if( this.GAME.canAfford(pp.cost) ){
             this.disabled = false;
             return true;
         } else {
             this.disabled = true;
             return false;
         }
       } else {
         return false;
       }
   }
//var pp = this.GAME.STATICVAR_HOLDER.SCIENCE.PROJECTTABLE[ this.value ];
     availListElem.onchange = function(){
       //var ppid = this.GAME.STATS["AVAIL_PROJECT_LIST"][this.fid][this.value];
       //var pp = this.GAME.STATICVAR_HOLDER.SCIENCE.PROJECTTABLE[ this.value ];
       var vv = this.value;     
       var pp = this.GAME.STATS["AVAIL_PROJECTS"][this.fid][vv];
       console.log("this.value="+this.value+", pp = "+pp);
       var dd = pp.desc;
       for(var k=0; k < pp.cost.length;k++){
          var ccc = fmtSIunits(pp.cost[k][1]);
          dd = dd + "<br> &nbsp&nbsp&nbsp"+ccc[0]+ccc[1]+ this.GAME.STATICVAR_HOLDER["INVENTORY_DESC_SHORT"][pp.cost[k][0]]
       }
       this.descElem.innerHTML = dd
       if( this.GAME.canAfford(pp.cost) ){
         this.researchButton.disabled = false;
       } else {
         this.researchButton.disabled = true;
       }
     }
     researchButton.onclick = function(){
        var vv = this.availListElem.value;     
        var pp = this.GAME.STATS["AVAIL_PROJECTS"][this.fid][vv];
        for(var kk = 0; kk < pp.cost.length; kk++){
           //console.log(this.availListElem.pp);           
           //console.log("BEFORE: [val="+this.availListElem.value+"] ["+pp.cost[kk][0]+"/\n"+pp.cost[kk][1]+"]:\n"+INVENTORY[ pp.cost[kk][0] ]);
           this.GAME.INVENTORY[ pp.cost[kk][0] ] = this.GAME.INVENTORY[ pp.cost[kk][0] ] - pp.cost[kk][1];
           //console.log("AFTER: ["+pp.cost[kk][0]+"/\n"+pp.cost[kk][1]+"]:\n"+INVENTORY[ pp.cost[kk][0] ]);
        }
        this.GAME.currentResearchEffect = this.GAME.STATICVAR_HOLDER.SCIENCE.PROJECTTABLE[ pp.projectID ].effect;
        this.GAME.currentResearchEffect();
        this.availListElem.remove(this.availListElem.selectedIndex)
        this.disabled = true;
     }
     
     var projectList   = STATICVAR_HOLDER.SCIENCE.MULTI[fid];
     var idx1 = Math.floor( getRandomBetween(0,projectList.length) );
     var idx2 = Math.floor( getRandomBetween(0,projectList.length - 1) );
     if(idx2 >= idx1){
       idx2 = idx2 + 1;
     }
     var ap1 = availListElem.addMultiProject(projectList[idx1],1)
     var ap2 = availListElem.addMultiProject(projectList[idx2],1)
     availListElem.value = ap1.uid;
     availListElem.onchange();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dyson Sphere / World Management:

/*UPGRADE_COST_FCN = {};
UPGRADE_COST_FCN["Bot"] = function(lvl){
    [["eng_SCIENCE_FREE",Math.pow(1.6,lvl) * 50e17]];
}
UPGRADE_COST_FCN["Green"] = function(lvl){
    [["bio_SCIENCE_FREE",Math.pow(1.6,lvl) * 50e17]];
}*/



for( var i = 0; i < WORLD_TYPE_LIST.length; i++){
    var worldType = WORLD_TYPE_LIST[i]
    INVENTORY["WORLDS-"+worldType+"-CT"]=0
    SETTINGS["ADD_MULTIPLIER"][worldType] = 1
    CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] = 0
    CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] = 0
    CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType] = []
    CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType] = []
}
INVENTORY["WORLDS-"+"Omni"+"-CT"] = 0
INVENTORY["WORLDS-"+"Fallow"+"-CT"] = 0
INVENTORY["WORLDS-"+"Neutral"+"-CT"] = 0
INVENTORY["WORLDS-"+"Hostile"+"-CT"] = 0
INVENTORY["WORLDS-"+"Secure"+"-CT"] = 0


for( var i = 0; i < DYSON_TYPE_LIST.length; i++){
   var worldType = DYSON_TYPE_LIST[i]
   var multDisplay = document.getElementById(""+worldType+"_wf_AddUnit")
   multDisplay.innerHTML = "1";
   var multUp = document.getElementById("button_wf"+worldType+"UP")
   var multDn = document.getElementById("button_wf"+worldType+"DN")
   multUp.disp = multDisplay
   multDn.disp = multDisplay
   multUp.worldType = worldType
   multDn.worldType = worldType
   multDn.mdn = multDn
   multUp.mdn = multDn
   INVENTORY["WORLDS-"+worldType+"-LVL"] = 1;

   multDn.disabled = true;
   multUp.onclick = function(){
     SETTINGS["ADD_MULTIPLIER"][this.worldType] = Math.round(SETTINGS["ADD_MULTIPLIER"][this.worldType] * 10)
     this.disp.innerHTML = fmtSIflat( SETTINGS["ADD_MULTIPLIER"][this.worldType] )
     this.mdn.disabled = false;
   }
   multDn.onclick = function(){
     SETTINGS["ADD_MULTIPLIER"][this.worldType] = Math.round(SETTINGS["ADD_MULTIPLIER"][this.worldType] / 10)
     this.disp.innerHTML = fmtSIflat( SETTINGS["ADD_MULTIPLIER"][this.worldType] )
     if(SETTINGS["ADD_MULTIPLIER"][this.worldType] <= 1){
       this.mdn.disabled = true;
     }
   }
   var addButtonList = ["BB","B","F","FF"]
   var addButtonMult = [10,1,1,10]
   var addButtonPos  = [false,false,true,true]
   for(var j=0;j < addButtonList.length;j++){
     var bname = addButtonList[j]
     var butelem = document.getElementById("button_wf"+worldType+bname)
     if(butelem != null){
         butelem.worldType = worldType;
         butelem.addMult = addButtonMult[j]
         butelem.addPositive = addButtonPos[j]
         butelem.onclick = function(){
           if(this.addPositive){
             startWorldConstruction(  this.worldType,this.addMult * SETTINGS["ADD_MULTIPLIER"][this.worldType])
           } else {
             startWorldDeconstruction(this.worldType,this.addMult * SETTINGS["ADD_MULTIPLIER"][this.worldType])
           }
         }
     }
   }
   var cancelElem =  document.getElementById("button_wf"+worldType+"Cancel")
   if(cancelElem != null){
      cancelElem.worldType = worldType;
      cancelElem.GAME = GAME_GLOBAL;
      cancelElem.onclick = function(){
        this.GAME.CONSTRUCTION_BUFFER["WORLDS_CONST"][this.worldType] = []
        this.GAME.CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][this.worldType] = 0;
        this.disabled = true;
        this.style.display = "none";
      }
   }
   var upgradeElem =  document.getElementById("button_wf"+worldType+"UPGRADE")
   if(upgradeElem != null){

      upgradeElem.worldType = worldType;
      upgradeElem.GAME = GAME_GLOBAL;
      //upgradeElem.UPCOST = UPGRADE_COST[worldType];
      //upgradeElem.canAfford = canAfford;
      //upgradeElem.makeCostAbbriv = makeCostAbbriv;
      //upgradeElem.STATICVAR_HOLDER = STATICVAR_HOLDER;
      upgradeElem.costDisplayElem = document.getElementById("wfUPGRADE_"+worldType+"_COST")
      upgradeElem.lvlDisplayElem = document.getElementById(worldType+"_wfLVL")
      upgradeElem.onclick = function(){
        var UPCOST = this.GAME.UPGRADE_COST[this.worldType];
        var currCost = this.GAME.STATS["CURRENT_UPGRADE_COST"][this.worldType]
        for(var kk = 0; kk < currCost.length; kk++){
           this.GAME.INVENTORY[ currCost[kk][0] ] = this.GAME.INVENTORY[ currCost[kk][0] ] - currCost[kk][1];
        }
        var lvl = this.GAME.INVENTORY["WORLDS-"+this.worldType+"-LVL"] + 1;
        this.GAME.INVENTORY["WORLDS-"+this.worldType+"-LVL"] = lvl
        this.GAME.STATS["CURRENT_UPGRADE_COST"][this.worldType] = UPCOST.calc(lvl);
        var costString = this.GAME.makeCostAbbriv(this.GAME.STATS["CURRENT_UPGRADE_COST"][this.worldType],", ");
        this.costDisplayElem.innerHTML = costString;
        this.lvlDisplayElem.innerHTML = "Lvl-"+lvl;
        UPCOST.effect();
      }
      var currCost = upgradeElem.GAME.STATS["CURRENT_UPGRADE_COST"][this.worldType]
      var costString = upgradeElem.GAME.makeCostAbbriv(currCost,", ");
      upgradeElem.costDisplayElem.innerHTML = costString;
      
      upgradeElem.canAffordTest = function(){
        //console.log(this.UPCOST);
        var currCost = this.GAME.STATS["CURRENT_UPGRADE_COST"][this.worldType];
        if( this.GAME.canAfford(currCost) ){
            this.disabled = false;
            return true;
        } else {
            this.disabled = true;
            return false;
        }
      }
      RESEARCH_BUTTONS.push(upgradeElem);
   }

}




function onInputSoloSliderPct(){
      var cval = parseFloat(this.value)
      this.pctDisplayA.innerHTML = roundTo(cval / 100,1)+"%";
      this.pctDisplayB.innerHTML = roundTo(100 - (cval / 100),1)+"%";
      this.currValue = cval / 10000
}

ELEMS["BIOMASS_CONTROL_SLIDER"] = document.getElementById("biomassSliderPct")
ELEMS["BIOMASS_CONTROL_SLIDER"].pctDisplayA = document.getElementById("biomass_PROD_CONTROL_PCT_DISPLAY")
ELEMS["BIOMASS_CONTROL_SLIDER"].pctDisplayB = document.getElementById("biomass_PWR_CONTROL_PCT_DISPLAY")
ELEMS["BIOMASS_CONTROL_SLIDER"].oninput  = onInputSoloSliderPct;
ELEMS["BIOMASS_CONTROL_SLIDER"].onchange = onInputSoloSliderPct;
ELEMS["BIOMASS_CONTROL_SLIDER"].currValue = 0.75;


CHEATADD_TYPE_LIST = ["Neutral","Hostile"]


for( var i = 0; i < CHEATADD_TYPE_LIST.length; i++){
   var worldType = CHEATADD_TYPE_LIST[i]
   var multDisplay = document.getElementById(""+worldType+"_wf_AddUnit")
   var multUp = document.getElementById("button_wf"+worldType+"UP")
   var multDn = document.getElementById("button_wf"+worldType+"DN")
   multUp.disp = multDisplay
   multDn.disp = multDisplay
   multUp.worldType = worldType
   multDn.worldType = worldType
   multDn.mdn = multDn
   multUp.mdn = multDn

   multDn.disabled = true;
   multUp.onclick = function(){
     SETTINGS["ADD_MULTIPLIER"][this.worldType] = Math.round(SETTINGS["ADD_MULTIPLIER"][this.worldType] * 10)
     this.disp.innerHTML = fmtSIflat( SETTINGS["ADD_MULTIPLIER"][this.worldType] )
     this.mdn.disabled = false;
   }
   multDn.onclick = function(){
     SETTINGS["ADD_MULTIPLIER"][this.worldType] = Math.round(SETTINGS["ADD_MULTIPLIER"][this.worldType] / 10)
     this.disp.innerHTML = fmtSIflat( SETTINGS["ADD_MULTIPLIER"][this.worldType] )
     if(SETTINGS["ADD_MULTIPLIER"][this.worldType] <= 1){
       this.mdn.disabled = true;
     }
   }
   var addButtonList = ["BB","B","F","FF"]
   var addButtonMult = [10,1,1,10]
   var addButtonPos  = [false,false,true,true]
   for(var j=0;j < addButtonList.length;j++){
     var bname = addButtonList[j]
     var butelem = document.getElementById("button_wf"+worldType+bname)
     butelem.worldType = worldType;
     butelem.addMult = addButtonMult[j]
     butelem.addPositive = addButtonPos[j]
     butelem.onclick = function(){
       if(this.addPositive){
         var worldAdd = INVENTORY["WORLDS-"+this.worldType+"-CT"] + this.addMult * SETTINGS["ADD_MULTIPLIER"][this.worldType]
         INVENTORY["WORLDS-"+this.worldType+"-CT"] = INVENTORY["WORLDS-"+this.worldType+"-CT"] + worldAdd
       } else {
         var worldsubtract = Math.min(INVENTORY["WORLDS-"+this.worldType+"-CT"],this.addMult * SETTINGS["ADD_MULTIPLIER"][this.worldType])
         INVENTORY["WORLDS-"+this.worldType+"-CT"] = INVENTORY["WORLDS-"+this.worldType+"-CT"] - worldsubtract
       }
     }
   }

}

//          <h5>OmniWorlds: <span id="Omni_CT"></span></h5>
//             <div class="buildCtrlPanel">
//              <button class = "button2" id ="button_wfOmniBB" > -- </button>
//              <button class = "button2" id ="button_wfOmniB" > - </button>
//              <button class = "button2" id ="button_wfOmniF" > + </button>
//              <button class = "button2" id ="button_wfOmniFF" > ++ </button>
//              <button class = "button3" id ="button_wfOmniUP" > &#8963; </button>
//             <div class="buildInfoPanel1">kS</div>
//             <div class="buildInfoPanel2">BEEP BEEP BEEP</div>
//              <button class = "button3" id ="button_wfOmniDN" > &#8964; </button>
//             </div>


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// COLLAPSIBLE CODE:

var coll = document.getElementsByClassName("collapsible");
var i;

for (var i = 0; i < coll.length; i++) {
  var cc = coll[i];
  cc.ELEMS_CONTENT = cc.nextElementSibling;
  cc.ELEMS_MODE1 = cc.ELEMS_CONTENT.getElementsByClassName("COLLAPSE_MODE1")
  cc.ELEMS_MODE2 = cc.ELEMS_CONTENT.getElementsByClassName("COLLAPSE_MODE2")
  
  if(cc.ELEMS_MODE2.length > 0){
    cc.MODALITY = "TRIPLE"
    cc.CURRMODE = "MODE2";
      cc.addEventListener("click", function() {
        if(this.CURRMODE == "MODE0"){
          console.log("MODE 1");
          this.CURRMODE = "MODE1";
          this.classList.toggle("active");
          this.ELEMS_CONTENT.style.display = "block";
          if(this.ELEMS_MODE1.length > 0){
            for(var i=0; i < this.ELEMS_MODE1.length;i++){
               this.ELEMS_MODE1[i].style.display = "block";
            }
          }
        } else if(this.CURRMODE == "MODE1"){
          console.log("MODE 2");
          this.CURRMODE = "MODE2"
          if(this.ELEMS_MODE1.length > 0){
            for(var i=0; i < this.ELEMS_MODE1.length;i++){
               this.ELEMS_MODE1[i].style.display = "none";
            }
          }
          if(this.ELEMS_MODE2.length > 0){
            for(var i=0; i < this.ELEMS_MODE2.length;i++){
               this.ELEMS_MODE2[i].style.display = "block";
            }
          }
        } else if(this.CURRMODE == "MODE2"){
          console.log("MODE 0");
          this.CURRMODE = "MODE0"
          this.classList.toggle("active");
          this.ELEMS_CONTENT.style.display = "none";
          if(this.ELEMS_MODE2.length > 0){
            for(var i=0; i < this.ELEMS_MODE2.length;i++){
               this.ELEMS_MODE2[i].style.display = "none";
            }
          }
          
        } else {
          console.log("ERROR: Impossible STATE: " +this.CURRMODE)
        }
      });

  } else {
    cc.MODALITY = "SIMPLE"
      cc.addEventListener("click", function() {

        this.classList.toggle("active");
        if (this.ELEMS_CONTENT.style.display === "none") {
          this.ELEMS_CONTENT.style.display = "block";
        } else {
          this.ELEMS_CONTENT.style.display = "none";
        }
      });
  }
  

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TICK: worldconstruction



function startWorldConstruction(worldType,batchCt){
  CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType].push([batchCt, (Date.now() + STATS["WORLD_BUILD_TIME"][worldType]) ])
  CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] = CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] + batchCt
}
function startWorldDeconstruction(worldType,batchCt){
  console.log("Deconstruct["+worldType+"]["+batchCt+"]: inv="+INVENTORY["WORLDS-"+worldType+"-CT"]+" ConBuf="+CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType]+" DecBuf="+CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType]);
  if(INVENTORY["WORLDS-"+worldType+"-CT"] + CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] - CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] < batchCt){
    //console.log("deconstructing ALL: "+batchCt+">"+INVENTORY[worldType]["CT"]);
    startWorldDeconstruction(worldType,INVENTORY["WORLDS-"+worldType+"-CT"] + CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] - CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType])
  } else if(CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] > 0){
    var leftToDecon = batchCt;
    if( CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] <= batchCt){
      leftToDecon = leftToDecon - CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType];
      CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] = 0;
      CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType] = [];
    } else {
      CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] = CONSTRUCTION_BUFFER["WORLDS_CONST_CT"][worldType] - batchCt;
      while(leftToDecon > 0){
        var idx = CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType].length-1;
        var xx = CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType][idx][0];
        if(xx > leftToDecon){
          CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType][idx][0] = xx - leftToDecon;
          leftToDecon = 0;
        } else {
          leftToDecon = leftToDecon - CONSTRUCTION_BUFFER["WORLDS_CONST"][worldType].pop()[0];
        }
      }
    }

    if(leftToDecon > 0){
      CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType].push([leftToDecon, (Date.now() + STATS["WORLD_DECON_TIME"][worldType]) ])
      CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] = CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] + leftToDecon
    }

  } else {
    //console.log("deconstructing Some: "+batchCt+"<="+INVENTORY[worldType]["CT"]);
    CONSTRUCTION_BUFFER["WORLDS_DECON"][worldType].push([batchCt, (Date.now() + STATS["WORLD_DECON_TIME"][worldType]) ])
    CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] = CONSTRUCTION_BUFFER["WORLDS_DECON_CT"][worldType] + batchCt
  }
}

//startWorldConstruction("Green",100)
//CONSTRUCTION_BUFFER["WORLDS_CONST"]["Green"]

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// CONSOLE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var AI_CONSOLE_AUTOSCROLL=true
var AI_CONSOLE_HTMOD=0
document.getElementById("AI_CONSOLE").scrollTop = document.getElementById("AI_CONSOLE").scrollHeight
printlnToAiConsole("")

document.getElementById("AI_CONSOLE").onscroll = function(){
    if(document.getElementById("AI_CONSOLE").scrollTop + AI_CONSOLE_HTMOD== document.getElementById("AI_CONSOLE").scrollHeight){
        AI_CONSOLE_AUTOSCROLL=true
    } else {
        AI_CONSOLE_AUTOSCROLL=false
    }
}

function printlnToAiConsole(ttt){
    document.getElementById("AI_CONSOLE").innerHTML = document.getElementById("AI_CONSOLE").innerHTML + "<BR> > " +ttt
    if(AI_CONSOLE_AUTOSCROLL){
      document.getElementById("AI_CONSOLE").scrollTop = document.getElementById("AI_CONSOLE").scrollHeight
      AI_CONSOLE_HTMOD = document.getElementById("AI_CONSOLE").scrollHeight - document.getElementById("AI_CONSOLE").scrollTop
    }
}
function printToAiConsole(ttt){
    document.getElementById("AI_CONSOLE").innerHTML = document.getElementById("AI_CONSOLE").innerHTML + "" +ttt
    if(AI_CONSOLE_AUTOSCROLL){
      document.getElementById("AI_CONSOLE").scrollTop = document.getElementById("AI_CONSOLE").scrollHeight
      AI_CONSOLE_HTMOD = document.getElementById("AI_CONSOLE").scrollHeight - document.getElementById("AI_CONSOLE").scrollTop
    }
}

console.log( document.getElementById("AI_CONSOLE").scrollTop)
console.log( document.getElementById("AI_CONSOLE").scrollHeight)



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CHEATS AND UNLOCKABLE VARS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




document.getElementById("CHEAT_LESSCRAZY").onclick = function(){
     STATS["CRAZY_LEVEL"] = STATS["CRAZY_LEVEL"] - 1
     if(STATS["CRAZY_LEVEL"] == -9){
       this.disabled = true
     }
     document.getElementById("CHEAT_MORECRAZY").disabled = false

   }

document.getElementById("CHEAT_MORECRAZY").onclick = function(){
     STATS["CRAZY_LEVEL"] = STATS["CRAZY_LEVEL"] + 1
     if(STATS["CRAZY_LEVEL"] == 9){
       this.disabled = true
     }
     document.getElementById("CHEAT_LESSCRAZY").disabled = false
   }

document.getElementById("CHEAT_HALTCRAZY").onclick = function(){
     STATS["CRAZY_ON"] = false
     document.getElementById("CHEAT_STARTCRAZY").disabled = false
     this.disabled = true
   }

document.getElementById("CHEAT_STARTCRAZY").onclick = function(){
     STATS["CRAZY_ON"] = true
     document.getElementById("CHEAT_HALTCRAZY").disabled = false
     this.disabled = true
   }

document.getElementById("CHEAT_RESET_CRAZY").onclick = function(){
     resetAllCrazy()
   }


////////////////////////////////////


// botSliderPct4 botSliderCheck4

for(var i=0;i<UNLOCKABLES.length;i++){
   document.getElementById("CHEAT_UNLOCK_"+UNLOCKABLES[i]).lockhide = document.getElementById("LOCKHIDE_"+UNLOCKABLES[i])
   document.getElementById("CHEAT_UNLOCK_"+UNLOCKABLES[i]).unlockid = UNLOCKABLES[i]
   document.getElementById("CHEAT_UNLOCK_"+UNLOCKABLES[i]).ss       = document.getElementById(UNLOCKABLE_SLIDERINFO[i][0]+"SliderPct"+  UNLOCKABLE_SLIDERINFO[i][1])
   document.getElementById("CHEAT_UNLOCK_"+UNLOCKABLES[i]).ss.lockbox.checked = true;

   document.getElementById("CHEAT_UNLOCK_"+UNLOCKABLES[i]).onclick = function(){
       if(UNLOCKS[this.unlockid]){
         this.lockhide.style.display = "none"
         this.innerHTML = "UNLOCK "+ this.unlockid
         this.ss.value = 0;
         this.ss.lockbox.checked = true;
          document.getElementById("CHEAT_UNLOCK_"+UNLOCKABLES[i]).ss
       } else {
         this.lockhide.style.display = "block"
         this.innerHTML = "LOCK "+ this.unlockid
       }
       UNLOCKS[this.unlockid]= ! UNLOCKS[this.unlockid]
     }

   document.getElementById("CHEAT_UNLOCK_"+UNLOCKABLES[i]).ss
}

document.getElementById("botSliderDisplayPct4").IS_LOCKED = true
document.getElementById("botSliderDisplayPct4").LOCKER = document.getElementById("LOCKHIDE_TRANSMUTEYOGURT")

document.getElementById("thinkSliderDisplayPct3").IS_LOCKED = true
document.getElementById("thinkSliderDisplayPct3").LOCKER = document.getElementById("LOCKHIDE_HACKING")

//document.getElementById("soulSliderDisplayPct2").IS_LOCKED = true
//document.getElementById("soulSliderDisplayPct2").LOCKER = document.getElementById("LOCKHIDE_ESPIONAGE")

document.getElementById("botSliderDisplayPct3").IS_LOCKED = true
document.getElementById("botSliderDisplayPct3").LOCKER = document.getElementById("LOCKHIDE_WASTEREPROCESS")

document.getElementById("greenSliderDisplayPct3").IS_LOCKED = true
document.getElementById("greenSliderDisplayPct3").LOCKER = document.getElementById("LOCKHIDE_BIOWEAPONS")

document.getElementById("greenSliderDisplayPct4").IS_LOCKED = true
document.getElementById("greenSliderDisplayPct4").LOCKER = document.getElementById("LOCKHIDE_COMPOST")

var settingsBG = document.getElementById('SETTINGS_WINDOW');
var settingsWindow = document.getElementById('SETTINGS_WINDOW_CONTENT');

document.getElementById("SETTINGS_BUTTON").onclick = function(){
    settingsBG.style.display="block"
    settingsWindow.style.display = "block"
    STATS["PAUSE"] = true;
    querySavegamesAndUpdate();
}

document.getElementById("SETTINGS_WINDOW_CLOSE").onclick = function(){
    settingsBG.style.display="none"
    settingsWindow.style.display = "none"
    STATS["PAUSE"] = false;

}

window.onclick = function(event) {
  if(event.target == settingsBG) {
    settingsBG.style.display="none"
    settingsWindow.style.display = "none";
  }
}

document.getElementById("ENABLE_CHEATS_CHECKBOX").oninput = function(){
  if(this.checked){
    console.log("TEST1")
    document.getElementById("CHEAT_DEBUG_PANEL").style.display = "block";
  } else {
    console.log("TEST2")
    document.getElementById("CHEAT_DEBUG_PANEL").style.display = "none";

  }
}






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Economy stuff
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/*
    addConstructionRequest("MATTER-Collected-CT",
                           (STATS["CONVERSIONS"]["collectPerSunPerTick"] * STATS["PRODUCTIVITY_RATING"]["bot"] * SETTINGS["bot_FRACTION"][0]) ,
                           STATS["COST-MATTER-Collected"])

    addConstructionRequest("MATTER-Processed-CT",
                           (STATS["CONVERSIONS"]["processPerSunPerTick"] * STATS["PRODUCTIVITY_RATING"]["bot"] * SETTINGS["bot_FRACTION"][1]) ,
                           STATS["COST-MATTER-Processed"] )
    addConstructionRequest("SHIP-CONSTRUCT-BUFFER",
                           (STATS["CONVERSIONS"]["shipPerSunPerTick"] * STATS["PRODUCTIVITY_RATING"]["bot"] * SETTINGS["bot_FRACTION"][4]) ,
                           STATS["COST-MATTER-Ship"])

executeAllConstructionRequests()

*/

function addConstructionRequest(inventoryItemName, requestCt, unitCost, industryID){
   //console.log("addConstructionRequest("+inventoryItemName+","+requestCt+","+unitCost)
   //console.log(inventoryItemName+"/"+requestCt+"/"+unitCost+"/"+industryID)
   this.CONSTRUCTION_REQUESTS.push( [inventoryItemName, requestCt, unitCost, requestCt, industryID] )
}


STATICVAR_HOLDER.SHARED_RESOURCE_LIST = ["MATTER-Waste-CT","MATTER-FreeGreen-CT",
                        "MATTER-Digested-CT",
                        "MATTER-FreeBot-CT",
                        "MATTER-Feedstock-CT",
                        "POWER"]

function executeAllConstructionRequests(){
  var iterationCausedChange = true;
  
  for(var j=0; j < this.CONSTRUCTION_REQUESTS.length;j++){
    var bb = this.CONSTRUCTION_REQUESTS[j][0];
    var industryID = this.CONSTRUCTION_REQUESTS[j][4];
    STATS["LIMIT-REASON"][industryID] = "";
    this.STATS["PRODUCTION-REQ"][industryID] = this.CONSTRUCTION_REQUESTS[j][1];
  }
  
  var resourceUserList = [];
  for(var i=0; i<this.STATICVAR_HOLDER.SHARED_RESOURCE_LIST.length; i++){
        var rr = this.STATICVAR_HOLDER.SHARED_RESOURCE_LIST[i];
        //console.log("  [[["+rr+"]]]:");
        resourceUserList[i] = [];
        var totalResourceRequested = 0;
        for(var j=0; j < this.CONSTRUCTION_REQUESTS.length;j++){
           if(this.CONSTRUCTION_REQUESTS[j][1] > 0){
             for(var k=0; k < this.CONSTRUCTION_REQUESTS[j][2].length; k++){
               if(rr == this.CONSTRUCTION_REQUESTS[j][2][k][0] && this.CONSTRUCTION_REQUESTS[j][2][k][1] > 0){
                 resourceUserList[i].push([j,k]);
                 //console.log("            [:"+this.CONSTRUCTION_REQUESTS[j][0]+"] uses "+rr);
                 totalResourceRequested = totalResourceRequested + this.CONSTRUCTION_REQUESTS[j][2][k][1] * this.CONSTRUCTION_REQUESTS[j][3];
               }
             }
           }
        }
  }
  
  //while(iterationCausedChange){
      iterationCausedChange = false;
      
      for(var i=0; i<this.STATICVAR_HOLDER.SHARED_RESOURCE_LIST.length; i++){
        var userList = resourceUserList[i];
        var rr = this.STATICVAR_HOLDER.SHARED_RESOURCE_LIST[i];
        //console.log("  [[["+rr+"]]]:");
        var userList = [];
        var totalResourceRequested = 0;
        for(var j=0; j < this.CONSTRUCTION_REQUESTS.length;j++){
           for(var k=0; k < this.CONSTRUCTION_REQUESTS[j][2].length; k++){
             if(rr == this.CONSTRUCTION_REQUESTS[j][2][k][0]){
               userList.push([j,k]);
               //console.log("            [:"+this.CONSTRUCTION_REQUESTS[j][0]+"] uses "+rr);
               totalResourceRequested = totalResourceRequested + this.CONSTRUCTION_REQUESTS[j][2][k][1] * this.CONSTRUCTION_REQUESTS[j][3];
             }
           }
        }
        if(rr == "POWER"){
           this.STATS["CURR_POWER_DEMAND"] = totalResourceRequested;
        }
        
        //console.log("    ["+rr+"]"+totalResourceRequested+" vs "+this.INVENTORY[rr]);
        if(this.INVENTORY[rr] <= 0){
          //console.log("    zero["+rr+"]");
          
          for(var j=0; j < userList.length;j++){
            var uu = userList[j];
            
            STATS["LIMIT-REASON"][this.CONSTRUCTION_REQUESTS[uu[0]][4]] = rr;
            this.CONSTRUCTION_REQUESTS[uu[0]][3] = 0;
            //console.log("            ZEROING:"+this.CONSTRUCTION_REQUESTS[j][0]);
            //console.log("                  ["+this.CONSTRUCTION_REQUESTS[uu[0]][0]+"]: "+fmtSIflat(this.CONSTRUCTION_REQUESTS[uu[0]][3]));
          }
        } else if(totalResourceRequested > 0 && totalResourceRequested > this.INVENTORY[rr]){
          iterationCausedChange = true;
          var frac = this.INVENTORY[rr] / totalResourceRequested;
          //console.log("    Insufficient["+rr+"]: "+frac);
          for(var j=0; j < userList.length;j++){
            var uu = userList[j];
            STATS["LIMIT-REASON"][this.CONSTRUCTION_REQUESTS[uu[0]][4]] = rr;
            //console.log("                  ["+this.CONSTRUCTION_REQUESTS[uu[0]][0]+"]: "+fmtSIflat(this.CONSTRUCTION_REQUESTS[uu[0]][3])+"=>"+fmtSIflat(this.CONSTRUCTION_REQUESTS[uu[0]][3] * frac))
            
            this.CONSTRUCTION_REQUESTS[uu[0]][3] = this.CONSTRUCTION_REQUESTS[uu[0]][3] * frac;
          }
        }
      }
  //}
  
  for(var i=0;i<this.CONSTRUCTION_REQUESTS.length;i++){
    var bb = this.CONSTRUCTION_REQUESTS[i][0];
    var industryID = this.CONSTRUCTION_REQUESTS[i][4];
    var reqCt = this.CONSTRUCTION_REQUESTS[i][3];
    for(var j=0; j<this.CONSTRUCTION_REQUESTS[i][2].length; j++){
      var ccx = this.CONSTRUCTION_REQUESTS[i][2][j][0];
      var uCost = this.CONSTRUCTION_REQUESTS[i][2][j][1];
      //console.log("        Expending["+fmtSIflat(reqCt * uCost)+" "+ccx+"]: on "+fmtSIflat(reqCt)+" "+this.CONSTRUCTION_REQUESTS[i][0]+" ["+this.INVENTORY[this.CONSTRUCTION_REQUESTS[i][0]]+"]")
      this.INVENTORY[ccx] = this.INVENTORY[ccx] - reqCt * uCost;
    }
    this.INVENTORY[bb] = this.INVENTORY[bb] + reqCt;
    this.STATS["PRODUCTION-CURR"][industryID] = reqCt;
  }
  this.CONSTRUCTION_REQUESTS = [];
  
}

function executeAllConstructionRequests_OLD(){
  var costResourceSet = new Set();
  var costRequests = {};
  for(var i=0;i<this.CONSTRUCTION_REQUESTS.length;i++){
    var bb = this.CONSTRUCTION_REQUESTS[i][0];
    var industryID = this.CONSTRUCTION_REQUESTS[i][4];
    var reqCt = this.CONSTRUCTION_REQUESTS[i][1];
    this.STATS["PRODUCTION-REQ"][industryID] = reqCt;
    for(var j=0; j<this.CONSTRUCTION_REQUESTS[i][2].length; j++){
      var xcc = this.CONSTRUCTION_REQUESTS[i][2][j][0];
      var reqCt = this.CONSTRUCTION_REQUESTS[i][1];
      var uCost = this.CONSTRUCTION_REQUESTS[i][2][j][1];
      if(costRequests[xcc] == null){
        costRequests[xcc] = []
      }
      costRequests[xcc].push([i,j,reqCt * uCost])
      costResourceSet.add(xcc)
    }
    
  }
  //console.log("costResourceSet: ")
  for(let ccx of costResourceSet.values() ){
     //console.log("    ccx["+ccx+"]")
     var cr = costRequests[ccx]
     var crTotal = 0;
     for(let crr of cr){
       crTotal = crTotal + crr[2];
     }
     var crTotalCalc = 0;
     if(crTotal > this.INVENTORY[ccx]){
       console.log("   insufficient["+ccx+"]: "+this.INVENTORY[ccx]+" / "+crTotal+"");
       for(let crr of cr){
         var uCost = this.CONSTRUCTION_REQUESTS[crr[0]][2][crr[1]][1];
         var currReqCt = this.CONSTRUCTION_REQUESTS[crr[0]][3];
         /*console.log("["+ccx+"]: ["+uCost+" / "+currReqCt+" / "+((crr[2] / crTotal) * INVENTORY[ccx]) / uCost+"]")*/
         this.CONSTRUCTION_REQUESTS[crr[0]][3] = Math.min( currReqCt, ((crr[2] / crTotal) * this.INVENTORY[ccx]) / uCost )
         crTotalCalc = crTotalCalc + 
         console.log("       crr["+this.CONSTRUCTION_REQUESTS[crr[0]][0]+"]: "+crr[0]+","+crr[1]+","+crr[2]+": "+uCost+", "+currReqCt +" = "+this.CONSTRUCTION_REQUESTS[crr[0]][3] + " ("+crTotalCalc+")");
       }
     }
  }
  for(var i=0;i<this.CONSTRUCTION_REQUESTS.length;i++){
    var bb = this.CONSTRUCTION_REQUESTS[i][0];
    
    var reqCt = this.CONSTRUCTION_REQUESTS[i][3];
    for(var j=0; j<this.CONSTRUCTION_REQUESTS[i][2].length; j++){
      var ccx = this.CONSTRUCTION_REQUESTS[i][2][j][0];
      var uCost = this.CONSTRUCTION_REQUESTS[i][2][j][1];
      this.INVENTORY[ccx] = this.INVENTORY[ccx] - reqCt * uCost;      
    }
    this.INVENTORY[bb] = this.INVENTORY[bb] + reqCt;
    this.STATS["PRODUCTION-CURR"][industryID] = reqCt;
  }
  this.CONSTRUCTION_REQUESTS = [];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tooltips:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /*"-"+(this.ttTextElem.clientHeight /4) + "px"*/


var ttList = document.getElementsByClassName("tooltipHolder");
var currentlyOpenTooltip = null;
var clickToggle = true

for(var i = 0; i < ttList.length; i++){
  ttList[i].ttTextElem      = ttList[i].firstElementChild
  ttList[i].ttTextElemArrow = ttList[i].ttTextElem.nextElementSibling
  /*ttList[i].ttTextElem.style.top = "-"+(ttList[i].ttTextElem.clientHeight /2) + "px"*/
  ttList[i].addEventListener('click',function(){
      if(currentlyOpenTooltip != null){
        currentlyOpenTooltip.ttTextElem.style.visibility = "hidden";
        currentlyOpenTooltip = null;
      }
      this.ttTextElem.style.visibility = "visible"
      currentlyOpenTooltip = this
      console.log("ht = "+this.ttTextElem.offsetHeight+", top:"+this.ttTextElem.style.top);
      clickToggle = false
  },false)
}

/*var ttList = document.getElementsByClassName("tooltipHolder");*/
var ttList_S1 = document.getElementsByClassName("ttSEC1");
var ttList_S2 = document.getElementsByClassName("ttSEC2");
var ttList_S3 = document.getElementsByClassName("ttSEC3");


function fitTooltipsToWindow(){
  if(window.innerWidth > 1000){
    var tt = ttList_S1;
    for(var i=0; i < tt.length; i++){
        tt[i].ttTextElem.style.position = "absolute";
        tt[i].ttTextElem.style.top = "-"+(tt[i].ttTextElem.clientHeight /2) + "px"
        tt[i].ttTextElem.style.left = "105%";
        tt[i].ttTextElem.style.right = "auto";
        tt[i].ttTextElem.style.bottom = "auto";
        tt[i].ttTextElem.className = "tooltiptext LT";
        tt[i].ttTextElem.style.width = "200px";

    }
    tt = ttList_S2;
    for(var i=0; i < tt.length; i++){
        tt[i].ttTextElem.style.position = "absolute";
        tt[i].ttTextElem.style.top = "-"+(tt[i].ttTextElem.clientHeight /2) + "px"
        tt[i].ttTextElem.style.left = "105%";
        tt[i].ttTextElem.style.right = "auto";
        tt[i].ttTextElem.style.bottom = "auto";
        tt[i].ttTextElem.className = "tooltiptext LT";
        tt[i].ttTextElem.style.width = "200px";
    }
    tt = ttList_S3;
    for(var i=0; i < tt.length; i++){
        tt[i].ttTextElem.style.position = "absolute";
        tt[i].ttTextElem.style.top = "-"+(tt[i].ttTextElem.clientHeight /2) + "px"
        tt[i].ttTextElem.style.right = "105%";
        tt[i].ttTextElem.style.left = "auto";
        tt[i].ttTextElem.style.bottom = "auto";
        tt[i].ttTextElem.className = "tooltiptext RT";
        tt[i].ttTextElem.style.width = "200px";

    }
  } else if(window.innerWidth >  640){
    var tt = ttList_S1;
    for(var i=0; i < tt.length; i++){
        tt[i].ttTextElem.style.position = "absolute";
        tt[i].ttTextElem.style.top = "-"+(tt[i].ttTextElem.clientHeight /2) + "px"
        tt[i].ttTextElem.style.left = "105%";
        tt[i].ttTextElem.style.right = "auto";
        tt[i].ttTextElem.style.bottom = "auto";
        tt[i].ttTextElem.className = "tooltiptext LT";
        tt[i].ttTextElem.style.width = "200px";

    }
    tt = ttList_S2;
    for(var i=0; i < tt.length; i++){
        tt[i].ttTextElem.style.position = "absolute";
        tt[i].ttTextElem.style.top = "-"+(tt[i].ttTextElem.clientHeight /2) + "px"
        tt[i].ttTextElem.style.right = "105%";
        tt[i].ttTextElem.style.left = "auto";
        tt[i].ttTextElem.style.bottom = "auto";
        tt[i].ttTextElem.className = "tooltiptext RT";
        tt[i].ttTextElem.style.width = "200px";

    }
    tt = ttList_S3;
    for(var i=0; i < tt.length; i++){
        tt[i].ttTextElem.style.position = "absolute";
        tt[i].ttTextElem.style.top = "-"+(tt[i].ttTextElem.clientHeight /2) + "px"
        tt[i].ttTextElem.style.right = "105%";
        tt[i].ttTextElem.style.left = "auto";
        tt[i].ttTextElem.style.bottom = "auto";
        tt[i].ttTextElem.className = "tooltiptext RT";
        tt[i].ttTextElem.style.width = "200px";

    }
  } else {
    for(var i=0; i < ttList.length; i++){
        ttList[i].ttTextElem.style.position = "fixed"
        ttList[i].ttTextElem.style.top = "auto";
        ttList[i].ttTextElem.style.bottom = 0;
        ttList[i].ttTextElem.style.left = 0;
        ttList[i].ttTextElem.style.right = 0;
        ttList[i].ttTextElem.style.width = "100%";
        ttList[i].ttTextElem.className = "tooltiptext RT";

    }
  }
}

fitTooltipsToWindow()

window.addEventListener('resize',fitTooltipsToWindow, false);


window.addEventListener('click',function(event) {
  if(currentlyOpenTooltip != null && clickToggle) {
    currentlyOpenTooltip.ttTextElem.style.visibility = "hidden";
    currentlyOpenTooltip = null;
  }
  clickToggle = true
},false);



//startWorldConstruction("Bot",1)
//STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR


INVENTORY["STARS-" + "G" +"-CT"] = 1;
INVENTORY["WORLDS-"+"Bot"+"-CT"] = 1

INVENTORY["POWER-FreeBot-CT"] = STATICVAR_HOLDER.WATTAGE_SOL_LUMINOSITY / 2;
INVENTORY["MATTER-Botbots-CT"] = STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR * 7;
INVENTORY["MATTER-Botpwr-CT"] = STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR * 3;
INVENTORY["MATTER-Waste-CT"] = STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR * 119;

INVENTORY["MATTER-FreeBot-CT"] = (STATICVAR_HOLDER.SOLAR_MASS / 2) - INVENTORY["MATTER-Botbots-CT"] - INVENTORY["MATTER-Botpwr-CT"] - (INVENTORY["MATTER-Waste-CT"] / 2);


var START_WITH_GREENWORLD = true;
if(START_WITH_GREENWORLD){
  INVENTORY["WORLDS-"+"Green"+"-CT"] = 1
  INVENTORY["POWER-FreeGreen-CT"] = STATICVAR_HOLDER.WATTAGE_SOL_LUMINOSITY / 2;
  INVENTORY["MATTER-Biomass-CT"] = STATICVAR_HOLDER.EARTHS_INDUSTRIAL_UNITFACTOR * 12;
  INVENTORY["MATTER-FreeGreen-CT"] = (STATICVAR_HOLDER.SOLAR_MASS / 2) - INVENTORY["MATTER-Biomass-CT"] - (INVENTORY["MATTER-Waste-CT"] / 2);
}



/*
INVENTORY["STARS-" + "G" +"-CT"] = 1;
INVENTORY["MATTER-FreeBot-CT"] = 1.9885e27;
INVENTORY["POWER-FreeBot-CT"] = STATICVAR_HOLDER.WATTAGE_SOL_LUMINOSITY;

INVENTORY["MATTER-Botbots-CT"] = 75000000;
INVENTORY["MATTER-Botpwr-CT"] = 25000000;
INVENTORY["MATTER-Waste-CT"] = 100000000;


INVENTORY["WORLDS-"+"Bot"+"-CT"] = 1


var START_WITH_GREENWORLD = true;
if(START_WITH_GREENWORLD){
  INVENTORY["STARS-" + "G" +"-CT"] = INVENTORY["STARS-" + "G" +"-CT"] + 1;
  INVENTORY["WORLDS-"+"Green"+"-CT"] = 1
  INVENTORY["MATTER-FreeGreen-CT"] = 1.9885e27;
  INVENTORY["POWER-FreeGreen-CT"] = STATICVAR_HOLDER.WATTAGE_SOL_LUMINOSITY;

  INVENTORY["MATTER-Biomass-CT"] = 100000000;
  //INVENTORY["MATTER-Biopwr-CT"] = 25000000;
  INVENTORY["MATTER-Waste-CT"] = 100000000;
}
*/