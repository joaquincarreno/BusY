class MovingBusAbsolute {
  constructor(info) {
    this.patente = info.patente
    this.nSteps = info.coords.length 
    this.coordinates = info.coords;
    this.timeStamps = info.timeStamps.map((x) => (Date.parse(x)));

    // console.log(this.timeStamps)
    this.firstTimeStamp = this.timeStamps[0]
    this.lastTimeStamp = this.timeStamps[this.nSteps - 1]
    this.currentStep = 0;
    this.position = [0, 0];
    this.orientation = 0;
    this.color = [0, 0, 0, 255]
    // console.log("-  logs  -");u
  }
  // updaters
  updateBus(time){
    this.updateStep(time);
    this.updatePosition(time);
    this.updateColor(time);
  }
  updateStep(time) {
    // console.log('currentStep', this.currentStep)
    if(time < this.timeStamps[0]){
      this.currentStep = 0
      // console.log('time earlier than first step for', this.patente)
      // console.log(new Date(time), '<' , new Date(this.timeStamps[0]))
      return
    }
    var i = 0;
    while (time > this.timeStamps[i + 1]) {
      i = i + 1;
      if (i >= this.nSteps) {
        this.currentStep = this.nSteps-1
        
        // console.log('time later than last step for', this.patente)
        // console.log(new Date(time), '>' , new Date(this.timeStamps[this.nSteps-1]))
        return
      }
    }
    // console.log('newStep', i)
    this.currentStep = i;
  }
  updatePosition(time) {
    const step = this.currentStep;
    const startTime = this.timeStamps[step];
    const endTime = this.timeStamps[step + 1];
    const relTime = (time - startTime) / (endTime - startTime)
    
    const startPosition = this.coordinates[step];
    const endPosition = this.coordinates[step + 1];
    
    const dx = endPosition[0] - startPosition[0];
    const dy = endPosition[1] - startPosition[1];
    
    if (dx == 0) {
      this.orientation = dy >= 0 ? Math.PI : -Math.PI;
    } else {
      this.orientation = Math.atan(dy / dx);
    }
    this.position = [startPosition[1] + dy * relTime, startPosition[0] + dx * relTime];
  }
  updateColor(time){
    if(time > this.lastTimeStamp || time < this.first){
      this.color = [0, 0, 0, 0]
    }else{
      const relTime = this.getRelativeTime(this.firstTimeStamp, this.lastTimeStamp, time)
      // console.log(relTime)
      this.color = [255 * relTime, 255 * relTime, 150]
    }
  }

  //getters
  getRelativeTime(start, end, current) {
    return ;
  }
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

export default MovingBusAbsolute;