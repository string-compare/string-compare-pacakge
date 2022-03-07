# string-compare-pacakge

This is a package that allows you to find the quickest possible differences between two strings.

We use the levenshtein distance formula to find the least amount of possible changes between two string. With these differences
We then map them into an array of objects that provide you with the error location and content.

DP Table:

ex:
justin -> nick


 |   | # | J | U | S | T | I | N |<br />
 | # | 0 | 1 | 2 | 3 | 4 | 5 | 6 |<br />
 | N | 1 | 1 | 2 | 3 | 4 | 5 | 6 |<br />
 | I | 2 | 2 | 2 | 3 | 4 | 5 | 6 |<br />
 | C | 3 | 3 | 3 | 3 | 4 | 5 | 6 |<br />
 | K | 4 | 4 | 4 | 4 | 4 | 5 | 6 |<br />
 
 

Through this method we determine where the 'divergences' in the paths between the two strings are 
and proceed to start from the end solution.

We start at the bottom right corner and traverse up finding the smallest number of changes until
we get back to the origin.

We transform the results into the error of errors through this process and return an array of the 
following type:

interface ErrorGroup {<br />
  errorString: string;<br />
  startIndex: number;<br />
  endIndex: number;< br />
  operation: Operation;<br />
}

where grouped errors (char 1-3 && all are 'delete' operations) are grouped together as one 
object in the array. 


Co-authored-by: Justin <justin@thewordisbird.dev> && Nick <nicholas.m.shankland@gmail.com>
