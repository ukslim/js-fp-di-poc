const { ref, val, makeBeans } = require('../container/beanFactory');
const car = require('./components/car');
const engine = require('./components/engine');


// Just for illustration purposes, the hard-coded conventional way of building this
// pair of dependent components.
// Note that we have to make the engine before the car, because the car must be passed the
// engine.

const traditionallyConstructedEngine = engine({ cc: 2000 });
const traditionallyConstructedCar = car({ name: 'Volvo', engine: traditionallyConstructedEngine });

console.log(`Traditional: ${traditionallyConstructedCar(50)}`);

// Again for illustration, building the components using the Reflect API rather than
// directly calling the functions. Building in the correct order is still necessary.

const reflectionConstructedEngine = Reflect.apply(engine, undefined, [{ cc: 3000 }]);
const reflectionConstructedCar = Reflect.apply(car, undefined, [{
  name: 'Citroen',
  engine: reflectionConstructedEngine
}]);

console.log(`Reflection: ${reflectionConstructedCar(40)}`);

// Now with the DI container. Now we can declare the car before the engine because the container
// will see to building in the necessary order.

const config = [
  {
    id: 'car',
    builder: car,
    props: {
      name: val('Ford'),
      engine: ref('engine'),
    }
  },
  {
    id: 'engine',
    builder: engine,
    props: {
      cc: val(1200),
    }
  }
];

const beans = makeBeans(config);
const dependencyInjectedCar = beans['car'];

console.log(`DI: ${dependencyInjectedCar(20)}`);
