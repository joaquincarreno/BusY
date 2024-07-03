class MovingBusAbsolute {
  constructor(info) {
    this.patente = info.patente
    this.nSteps = info.coords.length 
    this.coordinates = info.coords;
    // console.log(Date.parse(info.timeStamps[0]))
    this.timeStamps = info.timeStamps.map((x) => (Date.parse(x)));

    // console.log(this.timeStamps)\
    this.firstTimeStamp = this.timeStamps[0]
    this.lastTimeStamp = this.timeStamps[this.nSteps - 1]
    this.currentStep = 0;
    this.position = [0, 0];
    this.orientation = 0;
    // console.log("-  logs  -");u
  }
    updateStep(time) {
    if(time < this.timeStamps[0]){
      this.currentStep = 0
      return
    }
    var i = 0;
    while (time > this.timeStamps[i + 1]) {
      i = i + 1;
      if (i >= this.nSteps) {
        this.currentStep = this.nSteps-1
        return
      }
    }
    this.currentStep = i;
  }
  getRelativeTime(start, end, current) {
    return (current - start) / (end - start);
  }
  getCurrentCoordinates(step, relativeTime) {
    const start = this.coordinates[step];
    const end = this.coordinates[step + 1];
    // console.log("[getCurrentCoords] step count = ");
    // console.log(this.coordinates.length);
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    // console.log("getCurrentCoords: dx=", dx, "dy=", dy);
    if (dx == 0) {
      this.orientation = dy >= 0 ? Math.PI : -Math.PI;
    } else {
      this.orientation = Math.atan(dy / dx);
    }
    return [start[1] + dy * relativeTime, start[0] + dx * relativeTime];
  }
  getPosition(time) {
    this.updateStep(time);
    const step = this.currentStep;
    const startTime = this.timeStamps[step];
    const endTime = this.timeStamps[step + 1];
    const relTime = this.getRelativeTime(
      startTime,
      endTime,
      time
    );
    return this.getCurrentCoordinates(step, relTime);
  }
  getOrientation() {
    return (360 * this.orientation) / (2 * Math.PI);
  }
  getColor(time){
    if(time > this.lastTimeStamp || time < this.first){
      return [0, 0, 0, 0]
    }else{
      const relTime = this.getRelativeTime(this.firstTimeStamp, this.lastTimeStamp, time)
      // console.log(relTime)
      return [255 * relTime, 255 * relTime, 150]
    }
  }
}

export default MovingBusAbsolute;