import MovingBus from "./MovingBus";
class Buses {
  constructor(busList) {
    this.dict = {};
    // console.log(busList);
    busList.forEach((b) => {
      this.dict[b.patente] = new MovingBus(b);
    });
    // console.log(this);
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