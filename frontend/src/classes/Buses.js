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
    return this.dict[patente];
  }
}

export default Buses;