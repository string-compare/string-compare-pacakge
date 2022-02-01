# string-compare-pacakge

This is a package that allows you to find the quickest possible differences between two strings.

We use the levenshtein distance formula to find the least amount of possible changes between two string. With these differences
We then

ex:
justin -> jusin

DP
| J | U | S | T | I | N |
| J | 0 | 1 | 2 | 3 | 4 | 5 |
| U | 1 | 0 | 1 | 2 | 3 | 4 |
| S | 2 | 1 | 0 | 1 | 2 | 3 |
| I | 3 | 2 | 1 | 1 | 1 | 2 |
| N | 4 | 3 | 2 | 2 | 2 | 1 |


$ git commit -m "Refactor usability tests.
>
>
Co-authored-by: Justin <justin@thewordisbird.dev>
