import MovingBus from "./MovingBus";
import MovingBusAbsolute from "./MovingBusAbsolute";
class Buses {
  constructor(busList) {
    // console.log('[busList]', busList)
    this.earliestTimeStamp = new Date('3000/01/01'); // máxima fecha posible
    this.latestTimeStamp = new Date('1000/01/01'); // míxima fecha posble
    

    this.dict = {};
    // console.log(busList);
    busList.forEach((b) => {
      this.dict[b.patente] = new MovingBusAbsolute(b);
      // console.log(new Date(this.dict[b.patente].firstTimeStamp))
      if(this.dict[b.patente].firstTimeStamp < this.earliestTimeStamp){
        this.earliestTimeStamp = this.dict[b.patente].firstTimeStamp
      }
      
      if(this.dict[b.patente].lastTimeStamp > this.latestTimeStamp){
        this.latestTimeStamp = this.dict[b.patente].lastTimeStamp
      }
    });
    
    this.timeRange = this.latestTimeStamp - this.earliestTimeStamp;

    // console.log('[earliestTimeStamp]', new Date(this.earliestTimeStamp));
    // console.log('[latestTimeStamp]', new Date(this.latestTimeStamp));
    // console.log('[timeRange]', this.timeRange)
  }
  getBus(patente) {
    if(patente in this.dict){
      return this.dict[patente];
    }else{
      return false;
    }
  }
}

export default Buses;