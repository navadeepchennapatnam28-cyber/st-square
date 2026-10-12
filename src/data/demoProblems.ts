import { CodingProblem } from '../types';

export const initialDemoProblems: CodingProblem[] = [
  {
    id: 'prob-1',
    title: 'Find the Maximum Sum Subarray',
    slug: 'maximum-sum-subarray',
    difficulty: 'Medium',
    topic: 'Arrays & Dynamic Programming',
    acceptanceRate: '54.2%',
    solved: true,
    attempted: true,
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    sampleCases: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      },
      {
        input: 'nums = [5, 4, -1, 7, 8]',
        output: '23',
        explanation: 'The subarray [5, 4, -1, 7, 8] has the largest sum 23.'
      }
    ],
    hints: [
      'A brute force approach inspects every possible pair of start and end indices.',
      'Notice that if the current running sum becomes negative, it cannot help any future subarray produce a larger sum.',
      'Kadane\'s Algorithm maintains a running maximum ending at each index in single pass O(N) time.'
    ],
    starterCode: {
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Write your Kadane's algorithm here
        max_sum = nums[0]
        curr_sum = 0
        for x in nums:
            curr_sum = max(x, curr_sum + x)
            max_sum = max(max_sum, curr_sum)
        return max_sum`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your Kadane's algorithm here
        int maxSum = nums[0];
        int currSum = 0;
        for (int x : nums) {
            currSum = Math.max(x, currSum + x);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxSubArray(std::vector<int>& nums) {
        // Write your Kadane's algorithm here
        int maxSum = nums[0];
        int currSum = 0;
        for (int x : nums) {
            currSum = std::max(x, currSum + x);
            maxSum = std::max(maxSum, currSum);
        }
        return maxSum;
    }
};`
    },
    approaches: [
      {
        name: "Kadane's Algorithm (Optimal)",
        explanation: "Kadane's Algorithm is a dynamic programming technique that processes the array in linear time. At each position i, we decide whether to add nums[i] to the running subarray or begin a brand new subarray starting at nums[i]. If running sum becomes negative, it is discarded.",
        algorithmSteps: [
          'Initialize maxSum = nums[0] and currentSum = 0.',
          'Iterate through each number x in nums.',
          'Add x to currentSum: currentSum += x.',
          'Update maxSum = max(maxSum, currentSum).',
          'If currentSum < 0, reset currentSum = 0 (discarding negative prefix).',
          'Return maxSum after finishing array iteration.'
        ],
        timeComplexity: 'O(N) — Single pass through the array',
        spaceComplexity: 'O(1) — Constant extra memory used',
        codeSnippets: {
          python: `def maxSubArray(nums: list[int]) -> int:
    max_sum = float('-inf')
    curr_sum = 0
    
    for num in nums:
        curr_sum += num
        if curr_sum > max_sum:
            max_sum = curr_sum
        if curr_sum < 0:
            curr_sum = 0
            
    return max_sum`,
          java: `public int maxSubArray(int[] nums) {
    int maxSum = Integer.MIN_VALUE;
    int currSum = 0;
    
    for (int num : nums) {
        currSum += num;
        if (currSum > maxSum) {
            maxSum = currSum;
        }
        if (currSum < 0) {
            currSum = 0;
        }
    }
    return maxSum;
}`,
          cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = INT_MIN;
    int currSum = 0;
    
    for (int num : nums) {
        currSum += num;
        if (currSum > maxSum) {
            maxSum = currSum;
        }
        if (currSum < 0) {
            currSum = 0;
        }
    }
    return maxSum;
}`
        }
      },
      {
        name: 'Improved Prefix Sum (O(N^2))',
        explanation: 'Instead of re-summing from index i to j every time, we compute the running sum of subarray [i...j] by accumulating elements starting from i. This eliminates the innermost loop, reducing cubic complexity to quadratic.',
        algorithmSteps: [
          'Initialize maxSum with nums[0].',
          'Loop outer index i from 0 to N-1 (starting element).',
          'Initialize currentSum = 0.',
          'Loop inner index j from i to N-1, adding nums[j] to currentSum.',
          'Update maxSum = max(maxSum, currentSum) on every step.',
          'Return maxSum.'
        ],
        timeComplexity: 'O(N^2) — Two nested loops iterating over subarrays',
        spaceComplexity: 'O(1) — No auxiliary data structures needed',
        codeSnippets: {
          python: `def maxSubArray(nums: list[int]) -> int:
    max_sum = float('-inf')
    n = len(nums)
    
    for i in range(n):
        curr_sum = 0
        for j in range(i, n):
            curr_sum += nums[j]
            if curr_sum > max_sum:
                max_sum = curr_sum
                
    return max_sum`,
          java: `public int maxSubArray(int[] nums) {
    int maxSum = Integer.MIN_VALUE;
    int n = nums.length;
    
    for (int i = 0; i < n; i++) {
        int currSum = 0;
        for (int j = i; j < n; j++) {
            currSum += nums[j];
            maxSum = Math.max(maxSum, currSum);
        }
    }
    return maxSum;
}`,
          cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = INT_MIN;
    int n = nums.size();
    
    for (int i = 0; i < n; i++) {
        int currSum = 0;
        for (int j = i; j < n; j++) {
            currSum += nums[j];
            maxSum = max(maxSum, currSum);
        }
    }
    return maxSum;
}`
        }
      },
      {
        name: 'Brute Force Approach (O(N^3))',
        explanation: 'Evaluate all possible subarrays by generating every pair of starting and ending indices (i, j) and computing their sum with a third loop. While conceptually direct, this approach triggers Time Limit Exceeded (TLE) on large inputs.',
        algorithmSteps: [
          'Loop i from 0 to N-1 (start boundary).',
          'Loop j from i to N-1 (end boundary).',
          'Loop k from i to j to compute sum of subarray nums[i...j].',
          'Compare and record the maximum sum seen so far.',
          'Return overall maximum sum.'
        ],
        timeComplexity: 'O(N^3) — Three nested loops',
        spaceComplexity: 'O(1) — Constant memory',
        codeSnippets: {
          python: `def maxSubArray(nums: list[int]) -> int:
    max_sum = float('-inf')
    n = len(nums)
    
    for i in range(n):
        for j in range(i, n):
            sub_sum = sum(nums[i:j+1])
            max_sum = max(max_sum, sub_sum)
            
    return max_sum`,
          java: `public int maxSubArray(int[] nums) {
    int maxSum = Integer.MIN_VALUE;
    int n = nums.length;
    
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int subSum = 0;
            for (int k = i; k <= j; k++) {
                subSum += nums[k];
            }
            maxSum = Math.max(maxSum, subSum);
        }
    }
    return maxSum;
}`,
          cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = INT_MIN;
    int n = nums.size();
    
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int subSum = 0;
            for (int k = i; k <= j; k++) {
                subSum += nums[k];
            }
            maxSum = max(maxSum, subSum);
        }
    }
    return maxSum;
}`
        }
      }
    ]
  },
  {
    id: 'prob-2',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Hash Map & Arrays',
    acceptanceRate: '52.8%',
    solved: true,
    attempted: true,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    sampleCases: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]'
      }
    ],
    hints: [
      'Can you store complements in a Hash Map to achieve O(1) lookups?',
      'As you iterate, check if target - nums[i] is already in the map.'
    ],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, val in enumerate(nums):
            diff = target - val
            if diff in seen:
                return [seen[diff], i]
            seen[val] = i
        return []`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); ++i) {
            int diff = target - nums[i];
            if (map.count(diff)) {
                return {map[diff], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`
    },
    approaches: [
      {
        name: 'Hash Map Lookup (Optimal)',
        explanation: 'We iterate through the array once. For each number, calculate diff = target - nums[i]. If diff exists in our hash table, we found our answer in O(1) time. Otherwise store nums[i] -> index.',
        algorithmSteps: [
          'Create an empty hash map.',
          'For each element at index i, compute complement = target - nums[i].',
          'If complement exists in map, return [map[complement], i].',
          'Else, insert nums[i] into map with value i.'
        ],
        timeComplexity: 'O(N) — Single pass with O(1) hash map operations',
        spaceComplexity: 'O(N) — Hash map stores up to N elements',
        codeSnippets: {
          python: `def twoSum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, x in enumerate(nums):
        comp = target - x
        if comp in lookup:
            return [lookup[comp], i]
        lookup[x] = i
    return []`,
          java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int comp = target - nums[i];
        if (map.containsKey(comp)) {
            return new int[] { map.get(comp), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (map.find(comp) != map.end()) {
            return {map[comp], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`
        }
      },
      {
        name: 'Brute Force Nested Pair (O(N^2))',
        explanation: 'Inspect every combination of pairs (i, j) with i < j and verify if nums[i] + nums[j] == target.',
        algorithmSteps: [
          'Loop outer index i from 0 to N-2.',
          'Loop inner index j from i+1 to N-1.',
          'Check if nums[i] + nums[j] == target.',
          'Return [i, j] upon finding match.'
        ],
        timeComplexity: 'O(N^2) — Nested iteration over pairs',
        spaceComplexity: 'O(1) — No extra data structures required',
        codeSnippets: {
          python: `def twoSum(nums: list[int], target: int) -> list[int]:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
          java: `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[] { i, j };
            }
        }
    }
    return new int[0];
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}`
        }
      }
    ]
  },
  {
    id: 'prob-3',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    difficulty: 'Medium',
    topic: 'Sliding Window & Two Pointers',
    acceptanceRate: '34.5%',
    solved: false,
    attempted: true,
    description: `Given a string s, find the length of the longest substring without duplicate characters.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    sampleCases: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    hints: [
      'Use a sliding window bounded by left and right pointers.',
      'Maintain the most recent index of each character in a map or hash set.'
    ],
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_index = {}
        max_len = 0
        left = 0
        for right, ch in enumerate(s):
            if ch in char_index and char_index[ch] >= left:
                left = char_index[ch] + 1
            char_index[ch] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] last = new int[128];
        java.util.Arrays.fill(last, -1);
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last[c] >= left) {
                left = last[c] + 1;
            }
            last[c] = right;
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> last(256, -1);
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            if (last[s[right]] >= left) {
                left = last[s[right]] + 1;
            }
            last[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`
    },
    approaches: [
      {
        name: 'Sliding Window with Hash Map (Optimal)',
        explanation: 'Keep a dynamic window [left...right]. If the character s[right] was seen inside the window, jump left past its previous position immediately.',
        algorithmSteps: [
          'Initialize left = 0 and max_len = 0.',
          'Store last seen index of each character.',
          'Expand right pointer through string length.',
          'Update left if duplicate character is within current window.',
          'Record max_len = max(max_len, right - left + 1).'
        ],
        timeComplexity: 'O(N) — Each character visited at most twice',
        spaceComplexity: 'O(min(N, alphabet size)) — Hash map / array of character indices',
        codeSnippets: {
          python: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    max_len = left = 0
    for right, c in enumerate(s):
        if c in last_seen and last_seen[c] >= left:
            left = last_seen[c] + 1
        last_seen[c] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
          java: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c) && map.get(c) >= left) {
            left = map.get(c) + 1;
        }
        map.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> map;
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s[right];
        if (map.count(c) && map[c] >= left) {
            left = map[c] + 1;
        }
        map[c] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`
        }
      }
    ]
  },
  {
    id: 'prob-4',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topic: 'Two Pointers & Monotonic Stack',
    acceptanceRate: '61.1%',
    solved: false,
    attempted: false,
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    sampleCases: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.'
      }
    ],
    hints: [
      'Water trapped above any index i is min(max_left, max_right) - height[i].',
      'Can you maintain the smaller boundary using two converging pointers?'
    ],
    starterCode: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height: return 0
        left, right = 0, len(height) - 1
        left_max, right_max = height[left], height[right]
        water = 0
        while left < right:
            if left_max < right_max:
                left += 1
                left_max = max(left_max, height[left])
                water += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                water += right_max - height[right]
        return water`,
      java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;
        while (left < right) {
            if (height[left] <= height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;
        while (left < right) {
            if (height[left] <= height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};`
    },
    approaches: [
      {
        name: 'Two Pointers (Optimal)',
        explanation: 'Since the trapped water at any bar is determined by the shorter of the tallest bars to its left and right, we converge two pointers inward while maintaining leftMax and rightMax.',
        algorithmSteps: [
          'Initialize left = 0, right = n - 1, leftMax = 0, rightMax = 0, water = 0.',
          'While left < right:',
          'If height[left] <= height[right], process left; otherwise process right.',
          'Accumulate trapped units whenever current height is less than corresponding max.',
          'Return total accumulated water.'
        ],
        timeComplexity: 'O(N) — Pointers converge in single pass',
        spaceComplexity: 'O(1) — Constant auxiliary memory',
        codeSnippets: {
          python: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,
          java: `public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`,
          cpp: `int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`
        }
      }
    ]
  }
];
