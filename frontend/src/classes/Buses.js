import MovingBus from "./MovingBus";

const discreteSpeed = (s) => {
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

    this.heatMapData = []

    // create data dict
    this.createBuses();

    // fill heatMapData
    this.fillHeatMapData()

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
  updateBuses(time, mode, colorRange){
    const currTime = this.earliestTimeStamp + time * 1000;
    this.patentes.map((patente) => {
      this.dict[patente].updateBus(currTime, mode, colorRange);
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

        bus.speeds = bus.speeds.map((s) => discreteSpeed(s))

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
  fillHeatMapData(){
    this.heatMapData = new Array(this.totalSteps + 1);
    var i = 0;
    this.patentes.forEach((p) => {
      // si hay top deviation entonces todos tienen desviaciones
      const bus = this.getBus(p);
      if(bus.topDeviation){
        this.dict[p].topDeviation = this.topDeviation;
      }

      bus.topSpeed = this.topSpeed;

      const n = bus.nSteps;
      var j = 0;
      while(j < n){
        this.heatMapData[i+j] = {
          speed: bus.speeds[j], 
          deviation: bus.deviations[j],
          position: bus.coordinates[j]
        };
        j+=1
      }
      i += j;
    })
    // caso base para asegurarse que el rango de velocidades sea [0-6]
    this.heatMapData[this.totalSteps] = {
      speed: 6,
      deviation: 0,
      position: [0,0]
    }
  }
}

export default Buses;