import MovingBus from "./MovingBus";
class Buses {
  constructor(busList) {
    // console.log('[busList]', busList)
    this.earliestTimeStamp = (new Date('3000/01/01')).getTime(); // máxima fecha posible
    this.latestTimeStamp = (new Date('1970/01/01')).getTime(); // míxima fecha posble
    this.topDeviation = 0;
    this.allBusesHaveDeviation = true;
    this.patentes = []
    this.deviationList = []

    this.dict = {};
    if(busList.length > 0){
      console.log('Adding', busList.length ,'buses to dict');
      busList.forEach((b) => {
        const bus = new MovingBus(b);
        this.dict[b.patente] = bus
        // guardando límites de tiempo
        if(bus.firstTimeStamp < this.earliestTimeStamp){
          this.earliestTimeStamp = bus.firstTimeStamp
        }
        
        if(bus.lastTimeStamp > this.latestTimeStamp){
          this.latestTimeStamp = bus.lastTimeStamp
        }

        // guardando mayor desviación
        if(bus.topDeviation){
          this.topDeviation = bus.topDeviation > this.topDeviation ? bus.topDeviation : this.topDeviation;
        }else{
          this.allBusesHaveDeviation = false;
        }
      });
      
      this.patentes = Object.keys(this.dict)
      console.log('Added the following buses:', this.patentes)
    }else{
      const aux = this.earliestTimeStamp;
      this.earliestTimeStamp = this.latestTimeStamp;
      this.latestTimeStamp = aux;
      console.log('empty busList')
    }
    // deviations setup
    if(this.allBusesHaveDeviation){
      // si hay top deviation entonces todos tienen desviaciones,
      this.patentes.forEach((patente) => this.dict[patente].topDeviation = this.topDeviation)

      const deviationCount = this.patentes.reduce((partialSum, patente) => this.dict[patente].deviations.length + partialSum, 0)
      console.log(deviationCount)
      this.deviationList = new Array(deviationCount)
      var curr = 0;
      this.patentes.map((patente) => {
        const bus = this.dict[patente];
        const iterator = [...Array(bus.nSteps).keys()];
        iterator.forEach((step) => {
          // console.log(bus.deviations[step])
          this.deviationList[curr + step] = {
            position: bus.coordinates[step],
            weight: bus.deviations[step]
          }
        })
        curr += bus.nSteps
      })
      console.log('top deviations exists')
    }else{
      // no hay top deviation entonces les dejamos ser? no, actualizamos los que si tenían
      this.patentes.forEach((patente) => {
        if(this.dict[patente].topDeviation){
          this.dict[patente].topDeviation = this.topDeviation;
        }
      });
      console.log('no top deviation')
    }

    // time setup
    this.timeRange = this.latestTimeStamp - this.earliestTimeStamp;

  }
  getBus(patente) {
    if(patente in this.dict){
      return this.dict[patente];
    }else{
      return false;
    }
  }
  updateBuses(time, mode){
    const currTime = this.earliestTimeStamp + time * 1000;
    // console.log('updating buses');
    // console.log('time:', time * 1000);
    // console.log('currTime:', currTime)
    // console.log('in date', new Date(currTime))
    this.patentes.map((patente) => {
      // console.log('updating', patente);
      this.dict[patente].updateBus(currTime, mode);
    })
  }
  getDeviations(){
    if(this.allBusesHaveDeviation){
      return this.deviationList;
    }else{
      return [];
    }
  }
}

export default Buses;