class MovingBus {
  constructor(info) {
    this.coordinates = info.coords;
    const first = Date.parse(info.timestamps[0]);
    const timeRange =
      Date.parse(info.timestamps[info.timestamps.length - 1]) - first;
    this.timestamps = info.timestamps.map(
      (x) => (Date.parse(x) - first) / timeRange
    );
    this.currentStep = 0;
    this.position = [0, 0];
    this.orientation = 0;
    // console.log("-  logs  -");u
  }
  updateStep(time) {
    var i = 0;
    while (time > this.timestamps[i + 1]) {
      i = i + 1;
      if (i >= this.timestamps.lenght) {
        return new Error("time out of range");
      }
    }
    if (this.currentStep != i) {
      this.currentStep = i;
    }
  }
  getRelativeTime(start, end, current) {
    end = end - start;
    current = current - start;
    return current / end;
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
    const relTime = this.getRelativeTime(
      this.timestamps[step],
      this.timestamps[step + 1],
      time
    );
    return this.getCurrentCoordinates(step, relTime);
  }
  getOrientation() {
    return (360 * this.orientation) / (2 * Math.PI);
  }
}

export default MovingBus;