import { Mapper } from '../src/index';

class A {
  a = 1;
  c = { x: 1 };
}

class B {
  a = null;
  c = null;
  b = null;
  d = null;
  fn = () => {
    console.log(this.a);
  };
}

const a = new A();
const b = new B();

const mapper = new Mapper(A, B)
  .directMap('a')
  .directMap('c', true)
  .map('b', (a) => a.a)
  .map('d', (a) => JSON.stringify(a));

const c = mapper.exec(a);
console.log(a);
console.log(b);
console.log(c);
console.log(c.c === a.c);
