class MovingBus {
  constructor(info) {
    this.patente = info.patente
    this.nSteps = info.coords.length 
    this.coordinates = info.coords;
    this.timeStamps = info.timeStamps.map((x) => (Date.parse(x)));
    this.directions = info.directions;
    this.deviations = info.deviations;
    this.speeds = info.speeds;
    this.topSpeed = Math.max(...this.speeds)



    // console.log(this.timeStamps)
    this.firstTimeStamp = this.timeStamps[0]
    this.lastTimeStamp = this.timeStamps[this.nSteps - 1]
    if (null in this.deviations){
      // console.log('null in', this.patente)
      this.topDeviation = null;
    }else{
      // console.log('no nulls in', this.patente)
      this.topDeviation = Math.max(...this.deviations)
    }
    this.currentStep = 0;
    this.position = [0, 0];
    this.orientation = 0;
    this.color = [0, 0, 0, 255]
    // console.log("-  logs  -");u
  }
  // updaters
  updateBus(time, mode, colorRange){
    this.updateStep(time);
    this.updatePosition(time);
    this.updateColor(time, mode, colorRange);
  }
  updateStep(time) {
    // console.log('currentStep', this.currentStep)
    if(time < this.timeStamps[0]){
      this.currentStep = -1
      // console.log('time earlier than first step for', this.patente, 'setting step to -1')
      
      // console.log(new Date(time), '<' , new Date(this.timeStamps[0]))
      return
    }
    var i = 0;
    while (time > this.timeStamps[i]) {
      i = i + 1;
      if (i >= this.nSteps - 1) {
        this.currentStep = -2
        // console.log('time later than last step for', this.patente, 'setting step to -2')
        
        // console.log(new Date(time), '>' , new Date(this.timeStamps[this.nSteps-1]))
        return
      }
    }
    // console.log('newStep', i)
    this.currentStep = i; 
  }
  updatePosition(time) {
    const step = this.currentStep;
    if(step < 0){
        // console.log('negative step')
      
      // this.position = step == -1 ? this.coordinates[0] : this.coordinates[this.nSteps-1]
      this.position = [0, 0]
      // this.orientation = -> se mantiene la última orientación
      return
    }
    const startTime = this.timeStamps[step];
    const endTime = this.timeStamps[step + 1];
    const relTime = (time - startTime) / (endTime - startTime)
    
    const startPosition = this.coordinates[step];
    const endPosition = this.coordinates[step + 1];

    // console.log(this.patente);     
    // console.log(this.currentStep);
    // console.log(this.nSteps);
    
    // console.log(endPosition)
    // console.log(time)
    const dx = endPosition[0] - startPosition[0];
    const dy = endPosition[1] - startPosition[1];
    
    if (dx == 0) {
      this.orientation = dy >= 0 ? Math.PI : -Math.PI;
    } else {
      this.orientation = Math.atan(dy / dx);
    }
    this.position = [startPosition[0] + dx * relTime, startPosition[1] + dy * relTime];
  }
  updateColor(time, mode, colorRange){
    
    if(this.currentStep < 0){
      this.color = [0, 0, 0, 0]
      
    } else
    // mode 0 es por progreso de ruta
    if(mode == 0){
      
        const index = Math.floor((time - this.firstTimeStamp) / (this.lastTimeStamp - this.firstTimeStamp));
        // console.log(relTime)
        this.color = colorRange[index]
      
    // mode 1 es por desviación
    }else if(mode == 1){
      if(this.topDeviation){;
        const index = Math.floor(70 * this.deviations[this.currentStep] / this.topDeviation)
        this.color = colorRange[index]
      }else{
        this.color = [51, 51, 51, 255]
      }
      // mode 2 es por velocidad
    }else if(mode == 2){
      // console.log(this.speeds[this.currentStep])

      this.color = colorRange[10* this.speeds[this.currentStep]]
    }
    
  }

  //getters
  getOrientation() {
    return (360 * this.orientation) / (2 * Math.PI);
  }
  getPosition(){
    return this.position;
  }
  getColor(){
    return this.color;
  }
}

export default MovingBus;