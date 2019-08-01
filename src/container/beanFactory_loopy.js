// This was my first proof-of-concept and I leave it here because it might be informative
// if you're more imperative-minded.

// We loop through the bean definitions, attempting to build each one. If it can't be built
// because of an unbuilt dependency, we put it in a list of deferred builds instead. Then
// we repeat until there are no deferred builds.

// This will loop forever if the config contains unresolvable dependencies.
// It's quite possible to detect this and throw an error -- I just haven't done it.

const R = require('ramda');

const val = value => ({
  value,
  type: 'val'
});

const ref = id => ({
  value: id,
  type: 'ref'
});

const makeBeans = config => {
  const beans = {};

  const resolveProps = propsSpec => {
    // if any 'ref' props can't be resolved, return null
    const mustDefer = R.filter(prop => (prop.type === 'ref' && beans[prop.value] === undefined), propsSpec);
    if(!R.isEmpty(mustDefer)) {
      return null;
    }
    // else let's go for it
    return R.map(R.cond([
      [R.propEq('type', 'val'), R.prop('value')],
      [R.propEq('type', 'ref'), R.pipe(R.prop('value'), id => beans[id])],
      [R.T, () => { throw('Invalid type') }],
    ]),propsSpec)
  };

  let remainingConfig = config;

  while(remainingConfig.length > 0) {
    const deferred = [];
    config.forEach( item => {
      const props = resolveProps(item.props);
      if(!props) {
        deferred.unshift([item]);
      } else {
        beans[item.id] = Reflect.apply(item.builder, undefined, [props]);
      }
    });
    remainingConfig = deferred;
  }

  return beans;
};

module.exports = {
  ref,
  val,
  makeBeans,
};
