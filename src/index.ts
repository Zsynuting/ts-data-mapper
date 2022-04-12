import cloneDeep from 'lodash.clonedeep';

function isPrimitive(val: unknown) {
  if (typeof val === 'object') {
    return val === null;
  }
  return typeof val !== 'function';
}

type PropertyMapping<TSource, TTarget> = {
  propertyKey: keyof TTarget;
  mappingFn: (source: TSource) => any;
  deep?: boolean;
};

export class Mapper<TSource, TTarget> {
  private sourceType: new () => TSource;
  private targetType: new () => TTarget;
  private mappings: PropertyMapping<TSource, TTarget>[] = [];

  constructor(sourceType: new () => TSource, targetType: new () => TTarget) {
    this.sourceType = sourceType;
    this.targetType = targetType;
  }

  /**
   * map corresponding property directly, 'deep' indicates whether to deep clone this property
   * @param propertyKey 
   * @param deep 
   * @returns 
   */
  directMap(
    propertyKey: keyof TTarget | Array<keyof TTarget>,
    deep: boolean = false,
  ) {
    if (Array.isArray(propertyKey)) {
      propertyKey.forEach((key) => this._map(key, deep));
    } else {
      this._map(propertyKey as keyof TTarget, deep);
    }
    return this;
  }

  /**
   * map corresponding property by a mapping function, expecting mapping function to have a return value
   * @param propertyKey 
   * @param mappingFn 
   * @returns 
   */
  map(propertyKey: keyof TTarget, mappingFn: (source: TSource) => any) {
    this._map(propertyKey, false, mappingFn);
    return this;
  }

  private _map(
    propertyKey: keyof TTarget,
    deep: boolean,
    mappingFn?: (source: TSource) => any,
  ) {
    if (mappingFn) {
      this.mappings.push({
        propertyKey,
        mappingFn,
        deep,
      });
    } else {
      this.mappings.push({
        propertyKey,
        deep,
        mappingFn: (source: TSource) => {
          if (propertyKey in source) {
            const key = propertyKey as unknown;
            return source[key as keyof TSource] as any;
          }
          return undefined;
        },
      });
    }
    return this;
  }

  /**
   * map an object of source type to an object of target type 
   * @param source 
   * @returns 
   */
  exec(source: TSource): TTarget {
    const target = new this.targetType();
    this.mappings.forEach((mapping) => {
      const mappingResult = mapping.mappingFn(source);
      if (isPrimitive(mappingResult) || !mapping.deep) {
        target[mapping.propertyKey] = mappingResult;
      } else {
        target[mapping.propertyKey] = cloneDeep(mappingResult);
      }
    });
    return target;
  }
}
