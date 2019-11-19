'use strict';

      function drawChart() {
		//google.charts.load('current', {'packages':['gauge']});
		tableau.extensions.initializeAsync().then(function () {
			GetSheet1Data();
		});

      };

	  function GetSheet1Data() {

		// Init Extension 
		const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
		// Get the first Worksheet in DB
		const worksheet = worksheets[0];
		let unregisterHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.FilterChanged, filterChangedHandler);
        //unregisterHandlerFunctions.push(unregisterHandlerFunction);
			GetSummaryData(worksheet);
	  };
		
	  function GetSummaryData(worksheet) {
		
		// Get Data from Worksheet
		worksheet.getSummaryDataAsync().then(function (returnedData) {
			const MaxRowsData = returnedData.totalRowCount;

			// Default Options Object;
			var options = {
			//width: 400, height: 120,
			redFrom: 0, redTo: 0,
			yellowFrom: 80, yellowTo: 90,
			greenFrom: 90, greenTo: 100,
			minorTicks: 5, max: 100
			};

			// Check Nb Columns 
			switch (returnedData.data[0].length) {

				case 2: // Label/Value
					document.getElementById('field_name').innerText = '2 Colums Gauge Data ...';
					var n = MaxRowsData;
					var Index = 0;
					var data = PopulateGaugeData(MaxRowsData, returnedData, n, Index);
					DrawGauge(data, options);
				break;

				case 3: // Label/Value/RF/RT/YF/YT/GF/GT/Max
					document.getElementById('field_name').innerText = '9 Colums Gauge Data ...';
					var n = MaxRowsData/8
					var Index = 1;
					var data = PopulateGaugeData(MaxRowsData, returnedData, n, Index);
					// Get Max / Colors From-To
					var MaxGauge = parseInt(returnedData.data[0][2].value,10);
					var GreenTo = parseInt(returnedData.data[n*1][2].value,10);
					var GreenFrom = parseInt(returnedData.data[n*2][2].value,10);
					var YellowTo = parseInt(returnedData.data[n*3][2].value,10);
					var YellowFrom = parseInt(returnedData.data[n*4][2].value,10);
					var RedTo = parseInt(returnedData.data[n*5][2].value,10);
					var RedFrom = parseInt(returnedData.data[n*6][2].value,10);
					// Change Options
					options.redFrom = RedFrom;
					options.redTo = RedTo;
					options.yellowFrom = YellowFrom;
					options.yellowTo = YellowTo
					options.greenFrom = GreenFrom;
					options.greenTo = GreenTo;
					options.max = MaxGauge;
					DrawGauge(data, options);
				break;

				default: // Error
					alert('You have to manage 2 or 9 colums! (Here : '+returnedData.data[0].length+')');
			};
		});
	  };
	  function PopulateGaugeData(MaxRowsData, returnedData, n, Index) {
			// Loop populate array
			var DataArray = [];
			var i;
			var x;
			var y;
			DataArray[0] = ['Label','Value'];
			for (i = (MaxRowsData-n); i < MaxRowsData; i++) {
				x = returnedData.data[i][Index].value;
				y = parseInt(returnedData.data[i][Index+1].value, 10);
				DataArray[(i-(MaxRowsData-n)+1)] = [x,y];
			}
			// Pass Data Array
			var data = google.visualization.arrayToDataTable(DataArray);
			return data;
	  };
	  function DrawGauge (data, options) {
			// Draw Gauge
			document.getElementById('field_name').innerText = 'Drawing ...';
			var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
			chart.draw(data, options);
			document.getElementById('field_name').innerText = '';
	  }
	  function filterChangedHandler (filterEvent) {
		GetSummaryData(filterEvent.worksheet);
	  };