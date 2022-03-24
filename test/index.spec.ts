import { Mapper } from '../src/index';

class ClassA {
  a = 0;
  b = '1';
  c = { x: 1 };
  d = () => console.log('d');
}

class ClassB {
  a = null;
  b = null;
  c = null;
  d = null;
}

const a = new ClassA();

describe('test case', () => {
  let mapper: Mapper<ClassA, ClassB>;
  beforeEach(() => {
    mapper = new Mapper(ClassA, ClassB);
  });

  it('test direct map', () => {
    mapper.directMap('a').directMap(['b', 'c']);
    const b = mapper.exec(a);
    expect(b.a).toEqual(a.a);
  });

  it('test direct map deep clone', () => {
    mapper.directMap('c', true);
    const b = mapper.exec(a);
    expect(b.c === a.c).toBeFalsy();
    expect(b.c).toStrictEqual(a.c);
  });

  it('test map with mapping function', () => {
    mapper
      .map('a', (source) => source.a + 1)
      .map('c', (source) => JSON.stringify(source.c));
    const b = mapper.exec(a);
    expect(b.c).toEqual(JSON.stringify(a.c));
    expect(b.a).toEqual(a.a + 1);
  });

  it('test exec with any type', () => {
    mapper.directMap('a');
    expect(mapper.exec).toThrowError(Error);
    try {
      mapper.exec({} as ClassA);
    } catch (e) {
      console.log('catch error')
      expect(e).toBeInstanceOf(Error);
    }
  });
});
