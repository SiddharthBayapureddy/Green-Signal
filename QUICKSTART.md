# ⚡ Quick Start Guide

Get your agent running in **5 minutes**!

## Step 1: Start Backend (1 min)

```bash
cd ctf-toolkit
npm install
npm start
```

✅ You should see: "Server running on http://localhost:3000"

## Step 2: Set Up n8n (2 min)

**Easiest way:** Use n8n cloud
- Go to https://n8n.io
- Sign up (free)
- Create new workflow

**Or run locally:**
```bash
npx n8n
```

## Step 3: Import Workflow (1 min)

1. In n8n, click **"Import from File"**
2. Select `workflows/red-gate-starter.json`
3. Workflow loads! ✅

## Step 4: Add Your LLM (1 min)

1. Delete the sticky note that says "CONFIGURE THIS"
2. Add one of these nodes:
   - **OpenAI** (need API key)
   - **Anthropic Claude**
   - **HTTP Request** to any LLM API
3. Connect it between "Build LLM Prompt" and "Parse LLM Response"

## Step 5: Run! (30 sec)

1. Click **"Execute Workflow"**
2. Watch your agent work
3. **Get the flag!** 🚩

---

## Example: Using OpenAI

1. Add "OpenAI Chat Model" node
2. Enter API key
3. Set model: `gpt-4` or `gpt-3.5-turbo`
4. Connect the nodes
5. Execute!

The LLM will receive the prompt with login data and must return:
```json
{
  "users": ["bob", "dave"],
  "reasoning": "explanation..."
}
```

---

## Test Without n8n

Want to test the backend first?

```bash
# Get challenge data
curl http://localhost:3000/api/challenges/red-gate

# Submit answer (correct)
curl -X POST http://localhost:3000/api/validate/lock-user \
  -H "Content-Type: application/json" \
  -d '{"users":["bob","dave"],"reasoning":"Brute force detected"}'
```

You'll get the flag: `FLAG{red_gate_defended}` ✅

---

## Troubleshooting

**Backend won't start?**
- Check Node.js: `node --version` (need 14+)
- Port busy? Change PORT in server.js

**n8n workflow not working?**
- Make sure backend is running (http://localhost:3000/health)
- Check LLM node has valid API key
- Look at execution logs in n8n

**Need help?**
- Read full README.md
- Check backend terminal logs
- Test endpoints with curl

---

## What the Agent Does

1. **Fetches** login attempts from API
2. **Analyzes** with LLM to find brute-force patterns
3. **Identifies** users with 3+ failed attempts
4. **Explains** reasoning
5. **Submits** to validation API
6. **Captures** the flag! 🎉

---

**Ready? Let's go!** 🚀

```bash
npm start
```
