import {main} from '../editDistance';

describe('edit_distance', () => {
  it('case: 1', () => {
    const result = main('justin', 'jusin');
    const expectedResult = [
      {
        errorString: 't',
        startIndex: 3,
        endIndex: 4,
        operation: 'delete',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 2', () => {
    const result = main('justpfin', 'jusin');
    const expectedResult = [
      {
        errorString: 'tpf',
        startIndex: 3,
        endIndex: 6,
        operation: 'delete',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 3', () => {
    const result = main('jusin', 'justin');
    const expectedResult = [
      {
        errorString: 't',
        startIndex: 3,
        endIndex: 4,
        operation: 'insert',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 4', () => {
    const result = main('jusin', 'justpfin');
    const expectedResult = [
      {
        errorString: 'tpf',
        startIndex: 3,
        endIndex: 6,
        operation: 'insert',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 5', () => {
    const result = main('ab', 'ac');
    const expectedResult = [
      {
        errorString: 'b',
        startIndex: 1,
        endIndex: 2,
        operation: 'replace',
      },
    ];
    expect(result).toEqual(expectedResult);
  });
});
