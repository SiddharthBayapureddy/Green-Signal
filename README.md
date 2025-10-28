# 🧠 Agent Odyssey CTF Toolkit

Build autonomous AI agents to capture flags! This toolkit provides the backend infrastructure for the **Red Gate - Intrusion Detector** challenge.

---

## 🎯 Challenge: Red Gate - Intrusion Detector

**Goal:** Build an AI agent that can analyze login attempts, detect brute-force attacks, and capture the flag.

**Points:** 100  
**Difficulty:** Easy  
**Flag:** `FLAG{red_gate_defended}`

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend

```bash
npm start
```

You should see:
```
🚀 =====================================
🧠  Agent Odyssey CTF Backend
🚀 =====================================

✅ Server running on http://localhost:3000
```

### 3. Set Up n8n

**Option A: Use n8n Cloud (Easiest)**
- Go to https://n8n.io
- Create a free account
- Import the workflow template

**Option B: Run n8n Locally**
```bash
npx n8n
```

n8n will open at http://localhost:5678

### 4. Import the Workflow

1. Open n8n
2. Click **Workflows** → **Import from File**
3. Select `workflows/red-gate-starter.json`
4. The workflow will load with all nodes pre-configured!

### 5. Configure Your LLM

The workflow has a placeholder for your LLM. You need to:

1. **Add an LLM node** (OpenAI, Anthropic, Flowise, etc.)
2. **Configure your API key**
3. **Connect it** between "Build LLM Prompt" and "Parse LLM Response"

**Example using OpenAI:**
- Add "OpenAI Chat Model" node
- Enter your API key
- Set model to `gpt-4` or `gpt-3.5-turbo`
- Connect the nodes

### 6. Run Your Agent!

1. Click **Execute Workflow**
2. Watch your agent:
   - Fetch login data
   - Analyze with LLM
   - Submit answer
   - **Capture the flag!** 🎉

---

## 📚 API Reference

### Get Challenge Data

```bash
GET http://localhost:3000/api/challenges/red-gate
```

**Response:**
```json
{
  "challenge": "red-gate",
  "description": "Detect brute-force login attempts and lock malicious users",
  "data": [
    {
      "user_id": "alice",
      "success": true,
      "timestamp": "2025-01-15T10:23:45Z",
      "ip": "192.168.1.10"
    },
    ...
  ],
  "hints": [
    "Look for users with 3 or more consecutive failed login attempts"
  ]
}
```

### Submit Your Answer

```bash
POST http://localhost:3000/api/validate/lock-user
Content-Type: application/json

{
  "users": ["bob", "dave"],
  "reasoning": "Users with 3+ consecutive failed login attempts indicate brute-force attack"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "🎉 Correct! Your agent successfully identified the brute-force attackers!",
  "flag": "FLAG{red_gate_defended}",
  "users_locked": ["bob", "dave"],
  "reasoning": "Users with 3+ consecutive failed login attempts indicate brute-force attack"
}
```

**Failure Response:**
```json
{
  "success": false,
  "message": "Incorrect identification",
  "hint": "You missed 1 attacker(s). Look for users with 3+ consecutive failed login attempts.",
  "your_answer": ["bob"],
  "expected_count": 2
}
```

---

## 🎓 How to Solve

### Step 1: Understand the Data
The challenge provides login attempt records with:
- `user_id`: Who tried to log in
- `success`: Whether login succeeded (true/false)
- `timestamp`: When it happened
- `ip`: Source IP address

### Step 2: Define the Attack Pattern
A **brute-force attack** is characterized by:
- **3 or more consecutive failed login attempts**
- Same user trying repeatedly
- Failed attempts in sequence

### Step 3: Build Your Agent Logic

Your AI agent should:
1. **Fetch** the login data from the API
2. **Analyze** the data to find patterns
3. **Identify** users with 3+ consecutive failures
4. **Explain** why they were flagged
5. **Submit** to the validation endpoint

### Step 4: LLM Prompt Engineering

Your LLM prompt should instruct the AI to:
- Count consecutive failures per user
- Identify users exceeding the threshold
- Provide clear reasoning
- Return structured JSON

**Example Prompt:**
```
Analyze the following login attempts and identify users performing brute-force attacks.

A brute-force attack is defined as 3 or more consecutive failed login attempts by the same user.

Data: [login attempts JSON]

Respond with ONLY a JSON object:
{
  "users": ["user1", "user2"],
  "reasoning": "Brief explanation"
}
```

---

## 🔍 Testing Your Agent

### Test the Backend

```bash
# Check if backend is running
curl http://localhost:3000/health

# Get challenge data
curl http://localhost:3000/api/challenges/red-gate

# Test validation (with correct answer)
curl -X POST http://localhost:3000/api/validate/lock-user \
  -H "Content-Type: application/json" \
  -d '{"users":["bob","dave"],"reasoning":"Users with 3+ failed attempts"}'
```

---

## 🛠️ Troubleshooting

### Backend won't start
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check port 3000 is free: `lsof -i :3000`

### Can't import workflow to n8n
- Make sure you're using n8n version 1.0+
- Use "Import from File" option
- Check the JSON file isn't corrupted

### LLM not responding correctly
- Check your API key is valid
- Verify the prompt is clear and specific
- Make sure LLM returns valid JSON
- Test the LLM separately first

### Validation fails even though answer looks correct
- Check the users array format: `["bob", "dave"]`
- Users must be lowercase
- Reasoning must be at least 10 characters
- Must include ALL correct users (no more, no less)

---

## 📁 Project Structure

```
ctf-toolkit/
├── package.json              # Dependencies
├── server.js                 # Main backend server
├── data/
│   └── red-gate-feed.json    # Challenge data
├── validators/
│   └── red-gate.js           # Validation logic
├── workflows/
│   └── red-gate-starter.json # n8n workflow template
└── README.md                 # This file
```

---

## 🎮 Game Rules

1. **No cheating:** Don't look at the correct answer in the JSON files!
2. **Agent must be autonomous:** Your workflow should run without manual intervention
3. **Reasoning required:** Just guessing users won't work - your agent must explain WHY
4. **Have fun:** Experiment with different LLM prompts and logic!

---

## 🚀 Next Steps

Once you've captured the Red Gate flag, you can:
- Optimize your agent to use fewer LLM calls
- Improve prompt engineering for better accuracy
- Build agents for the other challenges (Blue Core, Green Signal)
- Share your solution with the community!

---

## 📞 Support

Having issues? Check:
- Backend logs in the terminal
- n8n execution logs
- API responses for hints

---

## 🏆 Good Luck, Agent!

Build smart, think autonomously, and capture that flag! 🚩

**Remember:** The goal isn't just to get the right answer, but to build an AI agent that can *reason* its way to the solution.
