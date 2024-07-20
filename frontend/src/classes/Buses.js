import MovingBus from "./MovingBus";

const discreteSpeeds = (s) => {
  if(s < 5) {
    return 0;
  }else if(s < 10){
    return 1;
  }else if(s < 15){
    return 2;
  }else if(s < 20){
    return 3;
  }else if(s < 30){
    return 4;
  }else if(s < 60){
    return 5;
  }else{
    return 6;
  }
}

class Buses {
  constructor(busData) {
    this.origData = busData

    this.dict = {};
    this.patentes = [];
    this.totalSteps = 0;

    this.topSpeed = 0;
    this.speedList = []

    this.earliestTimeStamp = (new Date('3000/01/01')).getTime(); // máxima fecha posible
    this.latestTimeStamp = (new Date('1970/01/01')).getTime(); // míxima fecha posble

    this.topDeviation = 0;
    this.allBusesHaveDeviation = true;
    this.deviationList = [];

    // create data dict
    this.createBuses();

    // fill deviations
    this.fillDeviationList();

    // create speeds keys
    this.fillSpeedList()

    // time setup
    this.timeRange = this.latestTimeStamp - this.earliestTimeStamp;
  }

  // getters
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
  getSpeeds(){
    return this.speedList
  }

  // data creation
  createBuses(){
    if(this.origData.length > 0){
      console.log('Adding', this.origData.length ,'buses to dict');
      this.origData.forEach((b) => {
        const bus = new MovingBus(b);
        this.dict[b.patente] = bus

        // guardando límites de tiempo
        if(bus.firstTimeStamp < this.earliestTimeStamp){
          this.earliestTimeStamp = bus.firstTimeStamp
        }
        if(bus.lastTimeStamp > this.latestTimeStamp){
          this.latestTimeStamp = bus.lastTimeStamp
        }

        // guardamos velocidad máxima
        this.topSpeed = this.topSpeed < bus.topSpeed ? bus.topSpeed : this.topSpeed;

        // guardando mayor desviación
        if(bus.topDeviation){
          this.topDeviation = bus.topDeviation > this.topDeviation ? bus.topDeviation : this.topDeviation;
        }else{
          this.allBusesHaveDeviation = false;
        }

        // contando la cantidad de puntos totales
        this.totalSteps += bus.nSteps
      });
      
      this.patentes = Object.keys(this.dict)
      console.log('Added the following buses:', this.patentes)
      // console.log('top speed:', this.topSpeed)
    }else{
      const aux = this.earliestTimeStamp;
      this.earliestTimeStamp = this.latestTimeStamp;
      this.latestTimeStamp = aux;
      this.allBusesHaveDeviation = false;
      console.log('empty busData')
    }
  }
  fillDeviationList(){
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
  }
  fillSpeedList(){
    this.speedList = new Array(this.totalSteps);
    var i = 0;
    this.patentes.forEach((p) => {
      const bus = this.getBus(p);
      bus.topSpeed = this.topSpeed;
      const n = bus.nSteps;
      var j = 0;
      while(j < n){
        this.speedList[i+j] = {
          // weight: bus.speeds[j], 
          weight: discreteSpeeds(bus.speeds[j]), 
          position: bus.coordinates[j]
        };
        j+=1
      }
      i += j;
    })
    console.log('speeds keys size:', this.speedList.length)
  }
}

export default Buses;