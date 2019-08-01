# js-fp-di-poc

### What?

This is a tiny, barebones, non-production proof of concept
function-oriented Dependency Injection container in Javascript and
Ramda.

I'd use it for educational purposes only.

### What's Dependency Injection?

Google it :) - but don't be daunted, it's really simple.

One of the most popular DI implementations is Spring Framework
(using Java), and educational material about Spring is often
a good way to understand DI.

A shameless plug: https://github.com/ukslim/spring-wiring-learning-exercise
is an exercise I wrote that I hope helps understand the usefulness of
DI in Spring.

### What does this proof-of-concept do?

I reuse the Spring nomenclature of "bean".

For this POC, we support a very limited bean spec: a higher-order-function
that takes a single argument of a `props` object, and returns a function.
The returned function is the bean.

    const prefixerBeanBuilder = (props) =>
         (planet) => `${props.prefix} ${planet}`;
         
We can create a bean by calling the factory:

    const helloBean = prefixerBeanBuilder({prefix: 'Hello'});
    
And then we have a first-order function we can call:

    console.log(helloBean('World');
    // 'Hello World'
    
But we don't want to be calling bean builders directly! We want
the framework to build and wire them for us.

The two `beanFactory` implementations both do the same thing -- 
 they're just written in different styles. They accept a configuration
referring to components of that style, and returns a map of beans.

    const config = [
       {
           id: 'hello',
           builder: prefixerBeanBuilder,
           props: {
              prefix: val('Hello'),
           }
       }
    ];
    const beans = beanFactory.makeBeans(config);
    console.log(beans['hello']('World'));
    // 'Hello World'

The magic happens when instead of a `val(...)` property, any
member of `props` is `ref('beanId')`. The bean factory will ensure
that the bean of that ID is initialised, then use it.

### Demos

`carDemo` is the simplest demo - two beans, one depending on the other.
Read the comments. 

`cardDemo` is slightly more complex in that the dependency chain is
 two-deep. Read the comments.

### Limitations

Lots! This is purely a proof of concept.

 - If a reference can't be resolved, these implementations will
   either loop forever or overflow the stack
 - The specification for the bean builders is very narrow
 - Most 'real' DI implementations defer bean creation until needed. 
   So a bean that's not requested directly, nor a dependency of one,
   will never get built. Ours, though, builds all the beans upfront.
 - Autowiring is a whole theme I haven't attempted.
 - Tons more.
 
As an academic exercise, you could attempt to improve it in any of
these areas. 

### Why?

I was baited by a blog post (to which I won't link) saying that OO
was rubbish, and Functional Programming was better, partly because
OO pushes you towards using DI.

I thought:

1. Dependency Injection is ace
2. There's nothing about FP that means you can't use DI,
   and since functions often depend on one another, DI
   can be very useful in FP.

After all, good FP is all about composable functions, and a (FP)
DI container is just a function that composes other functions in a
smart way.

Since at my workplace, [Wealth Wizards](https://www.wealthwizards.com/), we do our FP in Javascript
and Ramda.js, I went looking for a Javascript DI framework. There
are plenty of them, but all the ones I found focused on objects
instantiated with `new` -- which is fine; you could organise pure
functions in those objects. But I wanted to demonstrate that it
could be done with functions alone.
