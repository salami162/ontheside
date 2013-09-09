function Funnel () {
  this.serveLocal = true; // set to true to read json file locally.
  this.initialize();
}

Funnel.prototype.toJSON = function () {
  return {
    steps : this.steps
  };
};

Funnel.prototype.initialize = function () {
  this.steps = [
      {
          "count": 662,  
          "avg_total_time": "0:00",  
          "step_perc": "100.00%",  
          "avg_step_time": "0:00",  
          "step": "applied",  
          "cum_perc": "100.00%"
      },  
      {
          "count": 454,  
          "avg_total_time": "3 days, 2:16",  
          "step_perc": "68.58%",  
          "avg_step_time": "3 days, 2:16",  
          "step": "called",  
          "cum_perc": "68.58%"
      },  
      {
          "count": 183,  
          "avg_total_time": "3 days, 22:48",  
          "step_perc": "40.31%",  
          "avg_step_time": "1 day, 15:16",  
          "step": "call_connected",  
          "cum_perc": "27.64%"
      },  
      {
          "count": 144,  
          "avg_total_time": "3 days, 10:57",  
          "step_perc": "78.69%",  
          "avg_step_time": "0:00",  
          "step": "call_passed",  
          "cum_perc": "21.75%"
      },  
      {
          "count": 88,  
          "avg_total_time": "8 days, 15:28",  
          "step_perc": "61.11%",  
          "avg_step_time": "5 days, 15:43",  
          "step": "in_person_scheduled",  
          "cum_perc": "13.29%"
      },  
      {
          "count": 78,  
          "avg_total_time": "10 days, 22:41",  
          "step_perc": "88.64%",  
          "avg_step_time": "2 days, 17:15",  
          "step": "in_person_completed",  
          "cum_perc": "11.78%"
      },  
      {
          "count": 69,  
          "avg_total_time": "10 days, 23:17",  
          "step_perc": "88.46%",  
          "avg_step_time": "16:50",  
          "step": "in_person_passed",  
          "cum_perc": "10.42%"
      },  
      {
          "count": 55,  
          "avg_total_time": "15 days, 1:47",  
          "step_perc": "79.71%",  
          "avg_step_time": "4 days, 21:38",  
          "step": "shipped_kit",  
          "cum_perc": "8.31%"
      },  
      {
          "count": 55,  
          "avg_total_time": "17 days, 0:48",  
          "step_perc": "100.00%",  
          "avg_step_time": "1 day, 23:01",  
          "step": "driver_approved",  
          "cum_perc": "8.31%"
      }
  ];
};

module.exports = function () {
  return new Funnel();
};
