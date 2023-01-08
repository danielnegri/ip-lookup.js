const cache = require('../cache');

describe('Cache', () => {
  test('getCachedValueOrGenerateSerially', async () => {
    const fn = jest.fn().mockReturnValue('hello');

    const generatorFn = async function () {
      return fn();
    };

    const times = [...Array(10)];

    let result = await Promise.all(
      times.map(() => {
        return cache.getCachedValueOrGenerateSerially('Cache::getCachedValueOrGenerateSerially', generatorFn, 0);
      })
    );

    const expected = Array(10).fill('hello');
    expect(result).toEqual(expect.arrayContaining(expected));

    expect(fn.mock.calls.length).toBe(1);
  });
});
