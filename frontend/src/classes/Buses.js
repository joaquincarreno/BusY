import MovingBus from "./MovingBus";
import MovingBusAbsolute from "./MovingBusAbsolute";
class Buses {
  constructor(busList) {
    // console.log('[busList]', busList)
    this.earliestTimeStamp = (new Date('3000/01/01')).getTime(); // máxima fecha posible
    this.latestTimeStamp = (new Date('1970/01/01')).getTime(); // míxima fecha posble
    

    this.dict = {};
    if(busList.length > 0){
      console.log('Adding', busList.length ,'buses to dict');
      busList.forEach((b) => {
        const bus = new MovingBusAbsolute(b);
        this.dict[b.patente] = bus
        // console.log(new Date(this.dict[b.patente].firstTimeStamp))
        if(bus.firstTimeStamp < this.earliestTimeStamp){
          this.earliestTimeStamp = bus.firstTimeStamp
        }
        
        if(bus.lastTimeStamp > this.latestTimeStamp){
          this.latestTimeStamp = bus.lastTimeStamp
        }
      });
      console.log('Added the following buses:', Object.keys(this.dict))
    }else{
      const aux = this.earliestTimeStamp;
      this.earliestTimeStamp = this.latestTimeStamp;
      this.latestTimeStamp = aux;
      console.log('empty busList')
    }
    
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