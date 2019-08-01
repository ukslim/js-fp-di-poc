// Having proven it's possible in an imperative style in beanFactory_loopy.js,
// here's a rewrite in a FP style.

// This recurses, and will stack-overflow if there are unresolvable dependencies.
// It could:
//   - be refactored to use R.until()
//   - detect and error on unresolvable dependencies
// ... I just haven't done either.

const { both, propEq, propSatisfies, any, values, filter, reject, map, cond, T, mergeRight, unless, isEmpty, prop, curry, reduce, pipe } = require('ramda');

const val = value => ({
  value,
  type: 'val'
});

const ref = id => ({
  value: id,
  type: 'ref'
});

// beans => { type, value } => bool
const isUnresolvableReference = beans =>
  both(
    propEq('type', 'ref'),
    propSatisfies(v => (beans[v] === undefined), 'value')
  );

// [ beanDef ] => [ beanDef ]
const hasUnresolvableProperty = beans => propSatisfies(
  pipe(
    values,
    any(isUnresolvableReference(beans)),
  ),
  'props'
);

const configsToBeDeferred = ({ config, beans }) =>
  filter(hasUnresolvableProperty(beans))(config);

const configsBuildableNow = ({ config, beans }) =>
  reject(hasUnresolvableProperty(beans))(config);

const mapProps = (propsSpec, existingBeans) =>
  map(
    cond([
      [propEq('type', 'val'), prop('value')],
      [propEq('type', 'ref'), pipe(prop('value'), id => existingBeans[id])],
      [T, item => {
        throw(`Invalid type in ${item}`);
      }],
    ])
  )(propsSpec);

// { beans } => configItems => { newBeans }
const buildBean = curry(
  (existingBeans, configItem) => ({
    [configItem.id]: Reflect.apply(
      configItem.builder,
      undefined,
      [mapProps(configItem.props, existingBeans)])
  })
);

const toBeans = (buildableConfig, existingBeans) => reduce(
  mergeRight,
  existingBeans,
  map(buildBean(existingBeans), buildableConfig),
);

// { config, beans } => { config, beans }
const makeBeans_ = unless(
  propSatisfies(isEmpty, 'config'),
  ({ config, beans }) => makeBeans_({
    config: configsToBeDeferred({ config, beans }),
    beans: toBeans(configsBuildableNow({ config, beans }), beans)
  }),
);

// config => beans
const makeBeans = pipe(
  config => (makeBeans_({ config, beans: {} })),
  prop('beans'),
);

module.exports = {
  ref,
  val,
  makeBeans,
};
