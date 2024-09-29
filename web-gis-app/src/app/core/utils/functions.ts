type GetPropertyValueFn = {
  <T, K1 extends keyof T>(object: T, key1: K1): T[K1] | undefined;
  <T, K1 extends keyof T, K2 extends keyof T[K1]>(
    object: T,
    key1: K1,
    key2: K2
  ): T[K1][K2] | undefined;
  <T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    object: T,
    key1: K1,
    key2: K2,
    key3: K3
  ): T[K1][K2][K3] | undefined;
  <
    T,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(
    object: T,
    key1: K1,
    key2: K2,
    key3: K3,
    key4: K4
  ): T[K1][K2][K3][K4] | undefined;
  <
    T,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    object: T,
    key1: K1,
    key2: K2,
    key3: K3,
    key4: K4,
    key5: K5
  ): T[K1][K2][K3][K4][K5] | undefined;
  <
    T,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    object: T,
    key1: K1,
    key2: K2,
    key3: K3,
    key4: K4,
    key5: K5,
    key6: K6
  ): T[K1][K2][K3][K4][K5][K6] | undefined;
  <T>(object: T, properties: string[]): any;
};

/**
 * @param object object to access the value from
 * @param properties chained properties (`'property1', 'property2', 'etc'`) or array of property names (`[ 'property1', 'property2', 'etc' ]`)
 * @returns value of the object's property
 * @example
 * const testObject = {
 *   id: '1',
 *   nested: {
 *     name: 'Test'
 *   }
 * };
 * console.log(Utils.getPropertyValue(testObject, 'nested', 'name')); // Output: 'Test'
 * console.log(Utils.getPropertyValue(testObject, [ 'nested', 'name' ])); // This works too. Output: 'Test'
 */

export const getPropertyValue: GetPropertyValueFn = <T>(
  object: T,
  ...properties: string[] | string[][]
): any =>
  object &&
  properties &&
  properties.length &&
  (
    (Array.isArray(properties[0]) ? properties[0] : properties) as Array<string>
  ).reduce((acc: any, cur: any) => acc?.[cur], object);
