# ts-data-mapper

A typescript mapping tool supports mutual transforming between domain model and orm entity.
In most case, domain model is not fully compatible with orm entity. you may need a mapping tool to convert model to entity when persisting and convert it back when accessing data.

## installation
```
npm i ts-data-mapper
```

## usage
- pseudo-code below is for describing usage, not working directly. 
1. assuming you have class Model and class Entity as below
```
class Model {
  name: string
  otherInfo: OtherType
}

@Entity()
class Entity {
  @Column()
  name: string
  @Column()
  otherInfo: string
}
```
2. create a mapper (Model to Entity mapping)
```
import { Mapper } from 'ts-data-mapper'

const mapper = new Mapper(Model, Entity)
```
3. define mapping rules. you can direct map property(i.e. name), and map a property using a mapping function(i.e. otherInfo), when direct mapping a property, you can also assign the second parameter(deep?: boolean) to true to deep clone corresponding property value. Methods below (directMap and map) has type check, property key intellisense and supports method chaining.
```
mapper.directMap('name').map('otherInfo', (model) => JSON.stringify(model.otherInfo));
```
if it has a bunch of property to map directly, you can also do below.
```
mapper.directMap(['name', 'gender'])
```
4. map a source object to a target.
```
const model = new Model();
const entity = mapper.exec(model);
```
5. **(unnecessary)** you may want to add a 'toEntity' method to class Model and a 'toModel' method to class Entity
```
class Model {
  //...

  toEntity(): Entity {
    const mapper = new Mapper(Model, Entity).directMap('name').map('otherInfo', (model) => JSON.stringify(model.otherInfo));
    return mapper.exec(this);
  }
}

class Entity {
  //...

  toModel(): Model {
    const mapper = new Mapper(Entity, Model).directMap('name').map('otherInfo', (model) => JSON.parse(model.otherInfo));
    return mapper.exec(this);
  }
}
```