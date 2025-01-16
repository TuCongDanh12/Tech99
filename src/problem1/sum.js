// Solution A: Using a for loop
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Time Complexity: O(n)
// - The loop iterates through all numbers from 1 to n, so the runtime complexity is O(n).
// Space Complexity: O(1)
// - Uses only a single variable `sum` to store the total, no additional memory is required, so the space complexity is O(1).

// Solution B: Using a mathematical formula
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

// Time Complexity: O(1)
// - This is a simple mathematical formula, so the runtime is constant, O(1), regardless of n.
// Space Complexity: O(1)
// - Only a few temporary variables are used for computation, so space complexity is O(1).

// Solution C: Using recursion
var sum_to_n_c = function(n) {
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};

// Time Complexity: O(n)
// - The recursive function calls itself n times, decreasing n by 1 each time. Each recursive call adds time complexity, so the total time complexity is O(n).
// Space Complexity: O(n)
// - Each recursive call requires space in the call stack. As a result, the memory complexity is O(n), because the function needs to store each call until the base case is reached.


// Solution D: Using Array.reduce()
var sum_to_n_d = function(n) {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
};

// Time Complexity: O(n)
// - The method creates an array of n elements using `Array.from()` and then applies `reduce()` to calculate the sum. Both operations have O(n) time complexity, so the total time complexity is O(n).
// Space Complexity: O(n)
// - `Array.from()` creates an array with n elements, so space complexity is O(n) because an array of size n is created.


//So I think Solution B is the best

console.log(sum_to_n_a(5)); 
console.log(sum_to_n_b(5)); 
console.log(sum_to_n_c(5)); 
console.log(sum_to_n_d(5)); 
