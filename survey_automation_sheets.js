//Major function 
function selectDates(userInput) {
 
    //Initialize variables to get raw data from the form responses
    var ss = SpreadsheetApp.getActive();
    var sheet1 = ss.getSheetByName("Form Responses 1");
    var range = ss.getRange('A:M');      
    var rawData = range.getValues();
    
    //Initialize variables related to user input of date
    var input = new Date(userInput);
    var inputMonth = input.getMonth();
    var inputDate = input.getDate();
    var inputString = String(input);
    var inputStringSlice = inputString.slice(4,-24)
    
    //Initialize empty array to hold the filtered rows
    var data = [];                       
  
    for (var i = 1; i< rawData.length ; i++){
      var target = new Date(sheet1.getRange("A" + i).getValue());
      var targetDate = target.getDate()
      var targetMonth = target.getMonth()
  
      if(targetMonth == inputMonth && targetDate == inputDate) {
        data.push(rawData[i-1]);
      }
  }
    //Create a new sheet with all the raw data for certain dates
    var newSheet = ss.getSheetByName(userInput);
  
    if (newSheet != null) {
      ss.deleteSheet(newSheet);
      }
    
    newSheet = ss.insertSheet();
    newSheet.setName(userInput);
    
    //Setup data table in new sheet for Raw Data
    newSheet.getRange('A50').setValue('Raw Data for Select Date');
    newSheet.getRange(51,1,data.length,13).setValues(data)
    
    //Impact Data
    var impactData = newSheet.getRange(51,5,data.length,1).getValues();
    var impactLength = impactData.length; 
    
    //Create array of response options
    var impactOptions = [['Strongly Agree'],['Agree'],['Somewhat Agree'],['Somewhat Disagree'],['Disagree'],['Strongly Disagree']];
    
    // Create counter variables for each response option
    var counterStAgree = 0;
    var counterAgree = 0;
    var counterSoAgree = 0;
    var counterSoDisagree = 0;
    var counterDisagree = 0;
    var counterStDisagree = 0;
    
    // Loop through the data array counting the number of responses
    for (var name in impactData) { 
      
      if (impactData[name] == 'Strongly Agree') {
        counterStAgree = counterStAgree + 1;
      } else if (impactData[name] == 'Agree') {
        counterAgree ++;
      } else if (impactData[name] == 'Somewhat Agree') {
        counterSoAgree ++;
      } else if (impactData[name] == 'Somewhat Disagree') {
        counterSoDisagree ++;
      } else if (impactData[name] == 'Disagree') {
        counterDisagree ++;
      } else if (impactData[name] == 'Strongly Disagree') {
        counterStDisagree ++;
      }   
    }
    
    //Create array of response frequencies
    var impactFreq = [[counterStAgree],[counterAgree],[counterSoAgree],[counterSoDisagree],[counterDisagree],[counterStDisagree]];
    
    //Create array of response percentages
    var impactPer = [];
    
    for (var frequency in impactFreq) {
      impactPer[frequency] = [impactFreq[frequency]/impactLength];
    }
    
    //Challenge Data
    var challengeData = newSheet.getRange(51,8,data.length,1).getValues(); //creates an array of all the values in the challenge column
    
    var challengeLength = challengeData.length; //assigns the lengths of the "data" array to variable arrayLength
    
    //Create array of response options
    var challengeOptions = [['Frustratingly Hard'],['Pretty Challenging'],['Just Right'],['Somewhat Easy'],['Too Easy']];
    
    // Create counter variables for each response option
    var counterHard = 0;
    var counterChallenging = 0;
    var counterRight = 0;
    var counterSoEasy = 0;
    var counterEasy = 0;
    
    // Loop through the data array counting the number of responses
    for (var name in challengeData) { 
      
      if (challengeData[name] == 'Frustratingly Hard') {
        counterHard ++;
      } else if (challengeData[name] == 'Pretty Challenging') {
        counterChallenging ++;
      } else if (challengeData[name] == 'Just Right') {
        counterRight ++;
      } else if (challengeData[name] == 'Somewhat Easy') {
        counterSoEasy ++;
      } else if (data[name] == 'Too Easy') {
        counterEasy ++;
      }   
    }
    
    //Create array of response frequencies
    var challengeFreq = [[counterHard],[counterChallenging],[counterRight],[counterSoEasy],[counterEasy]];
    
    //Create array of response percentages
    var challengePer = [];
    
    for (var frequency in challengeFreq) {
      challengePer[frequency] = [challengeFreq[frequency]/challengeLength];
    }
  
    //Setup data table in new sheet for Impact
    newSheet.getRange('A1').setValue('Positive Impact on Instruction');
    newSheet.getRange('A2').setValue('Response');
    newSheet.getRange('B2').setValue('Frequency');
    newSheet.getRange('C2').setValue('Percentage');
    newSheet.getRange('A3:A8').setValues(impactOptions);
    newSheet.getRange('B3:B8').setValues(impactFreq);
    newSheet.getRange('C3:C8').setValues(impactPer);
    
    //Setup data table in new Sheet for Challenge
    newSheet.getRange('A16').setValue('Right Level of Challenge');
    newSheet.getRange('A17').setValue('Response');
    newSheet.getRange('B17').setValue('Frequency');
    newSheet.getRange('C17').setValue('Percentage');
    newSheet.getRange('A18:A22').setValues(challengeOptions);
    newSheet.getRange('B18:B22').setValues(challengeFreq);
    newSheet.getRange('C18:C22').setValues(challengePer);
    
    //Format the Impact table in the new sheet
    newSheet.getRange('A1:C1').mergeAcross().setHorizontalAlignment('center').setFontSize(14);
    newSheet.getRange('A1:C8').applyRowBanding(SpreadsheetApp.BandingTheme.BLUE, true, false);
    newSheet.getRange('A:L').setWrap(true);
    newSheet.getRange('C3:C8').setNumberFormat('0.00%');
    newSheet.getRange('A1:C2').setFontWeight('bold');
    
    //Format the Challenge table in the new sheet
    newSheet.getRange('A16:C16').mergeAcross().setHorizontalAlignment('center').setFontSize(14);
    newSheet.getRange('A16:C22').applyRowBanding(SpreadsheetApp.BandingTheme.BLUE, true, false);
    newSheet.getRange('C16:C22').setNumberFormat('0.00%');
    newSheet.getRange('A16:C17').setFontWeight('bold');
    
    //Create impact graph in new sheet
    var impactChartLabels = newSheet.getRange('A3:A8');
    var impactChartValues = newSheet.getRange('C3:C8');
    
    var impactChart = newSheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(impactChartLabels)
      .addRange(impactChartValues)
      .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
      .setPosition(1,5,0,0)
      .setOption("title","Positively Impact Instructional Practice")
      .build();
    
    newSheet.insertChart(impactChart);
    
    //Create impact graph in new sheet
    var challengeChartLabels = newSheet.getRange('A18:A22');
    var challengeChartValues = newSheet.getRange('C18:C22');
    
    var challengeChart = newSheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(challengeChartLabels)
      .addRange(challengeChartValues)
      .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
      .setPosition(16,5,0,0)
      .setOption("title","Right Level of Challenge")
      .build();
    
    newSheet.insertChart(challengeChart);
  
  }  
  
  
  //User Input for Dates
  function inputDate () {
   
    var ui = SpreadsheetApp.getUi();
    var response = ui.prompt('Running Analysis', 'What date do you want to analyze? (e.g., October 10, 2018)',ui.ButtonSet.YES_NO );
  
  // Process the user's response.
    if (response.getSelectedButton() == ui.Button.YES) {
      selectDates(response.getResponseText())
      Logger.log('Date Entered');
    } else if (response.getSelectedButton() == ui.Button.NO) {
      Logger.log('The user did not enter a date');
    } else {
      Logger.log('The user clicked the close button in the dialog\'s title bar.');
    }
     
  }
  
  //Creating the New Menu with Dropdown
  function onOpen() {
    
   var ui = SpreadsheetApp.getUi();
    
    ui.createMenu("Custom Analysis")
      .addItem("Begin Analysis...","inputDate")
      .addToUi();
    
  }