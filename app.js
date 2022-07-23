const express = require('express');
const ExpressError = require('./errors');

const app = express();

app.use(express.json());

function getNumList(obj) {
    let nums = [];
    for (num in obj) {
        let n = obj[num].replaceAll(',', '');
        n.split('').map((n) => {
            nums.push(Number(n))
        });
    }
    if (nums.length === 0) {
        throw new ExpressError('Numbers are required.', 400)
    }
    return nums
}

function checkNaN(arr) {
    for(let i = 0; i < arr.length; i++) {
        if(Number.isNaN(arr[i])) {
            throw new ExpressError('Not a number!', 404)
        }
    }
}

app.get('/mean', (req, res) => {
    let nums = getNumList(req.query);
    checkNaN(nums);
    let total = 0;
    for(let i = 0; i < nums.length; i++) {
        total += nums[i]
    }
    let mean = total / nums.length;
    return res.json({response: {
        operation: "mean",
        value: mean
    }})
});

app.get('/median', (req, res) => {
    let nums = getNumList(req.query);
    checkNaN(nums);
    const median = arr => {
        const mid = Math.floor(arr.length / 2),
          nums = [...arr].sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      };
    return res.json({response: {
        operation: "median",
        value: median(nums)
    }})
});

app.get('/mode', (req, res) => {
    let nums = getNumList(req.query);
    checkNaN(nums);
    const mode = a => {
        const count = {};
        
        a.forEach(e => {
          if (!(e in count)) {
            count[e] = 0;
          }
      
          count[e]++;
        });
      
        let bestElement;
        let bestCount = 0;
      
        Object.entries(count).forEach(([k, v]) => {
          if (v > bestCount) {
            bestElement = k;
            bestCount = v;
          }
        });
        
        return bestElement;
    };
    return res.json({response: {
        operation: "mode",
        value: mode(nums)
    }})
})

app.listen(3000, function() {
    console.log("Server running on port 3000.");
});