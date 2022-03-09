import {edit_distance} from '../editDistance';

describe('edit_distance', () => {
  it('case: 1', () => {
    const result = edit_distance('justin', 'jusin');
    const expectedResult = [
      {
        errorString: 't',
        startIndex: 3,
        endIndex: 4,
        expIndices: [2],
        genIndices: [3],
        operation: 'delete',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 2', () => {
    const result = edit_distance('justpfin', 'jusin');
    const expectedResult = [
      {
        errorString: 'tpf',
        startIndex: 3,
        endIndex: 6,
        expIndices: [2, 2, 2],
        genIndices: [3, 4, 5],
        operation: 'delete',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 3', () => {
    const result = edit_distance('jusin', 'justin');
    const expectedResult = [
      {
        errorString: 't',
        startIndex: 3,
        endIndex: 4,
        expIndices: [3],
        genIndices: [2],
        operation: 'insert',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 4', () => {
    const result = edit_distance('jusin', 'justpfin');
    const expectedResult = [
      {
        errorString: 'tpf',
        startIndex: 3,
        endIndex: 6,
        genIndices: [2, 2, 2],
        expIndices: [3, 4, 5],
        operation: 'insert',
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('case: 6', () => {
    const result = edit_distance('ab', 'ac');
    const expectedResult = [
      {
        errorString: 'c',
        startIndex: 1,
        endIndex: 2,
        genIndices: [1],
        expIndices: [1],
        operation: 'replace',
      },
    ];
    expect(result).toEqual(expectedResult);
  });
});
