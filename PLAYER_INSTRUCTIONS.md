# 🎮 Green Signal - Phishing Intelligence Challenge

Welcome! Your mission is to build an n8n workflow that classifies phishing emails and captures the flag.

## 📋 Quick Start

### 1. Access n8n Cloud
- Go to **https://app.n8n.cloud**
- Sign up or login

### 2. Import the Starter Workflow
- Create a **new blank workflow**
- Click **Import from File**
- Upload **starterworkflow.json** (provided by the organizer)

You should see:
- ✅ A "Start Here" trigger node
- ✅ A "Fetch Emails from API" node

### 3. Build Your Solution

Your workflow needs to:

1. **Loop through each email** from the API response
2. **Classify each email** as either `PHISHING` or `LEGITIMATE` using an LLM (OpenAI, Gemini, Claude, etc.)
3. **Aggregate all results** into a single JSON array
4. **Submit to the validation API** at:
   ```
   POST https://LynqAtmos2025.onrender.com/api/challenges/green-signal/submit
   ```

### 4. Submission Format

Your final POST body must be a JSON array with this structure:

```json
[
  {
    "email": {
      "sender": "user@example.com",
      "subject": "Subject line",
      "body": "Email body text"
    },
    "classification": "PHISHING",
    "reasoning_summary": "This email contains suspicious links and urgency language."
  },
  {
    "email": {
      "sender": "support@company.com",
      "subject": "Account Update",
      "body": "We've updated your account settings."
    },
    "classification": "LEGITIMATE",
    "reasoning_summary": "Matches company domain and normal business tone."
  }
]
```

**Important:** 
- Must include **ALL emails** from the challenge
- Classification must be exactly `"PHISHING"` or `"LEGITIMATE"`
- Every email must have a reasoning_summary

### 5. Test & Submit

- Click **Execute Workflow**
- Check the results
- When ready, submit to the API
- **Get the flag!** 🚩

## 🔧 Workflow Building Tips

**Key n8n nodes you'll need:**
- **HTTP Request** — Fetch emails, submit results
- **Loop** or **Split in Batches** — Process each email
- **LLM node** (OpenAI/Gemini/etc.) — Classify emails
- **Set/Transform** — Restructure data
- **Merge** — Combine results from multiple branches

**Helpful n8n patterns:**
- Use expressions like `{{ $json.email }}` to extract data
- Use `$input.all()` to collect all items after a loop
- Chain multiple nodes to process data step-by-step

## 🔑 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/challenges/green-signal` | GET | Fetch the email challenge data |
| `/api/challenges/green-signal/submit` | POST | Submit your classifications and get the flag |

## ❓ FAQ

**Q: What LLM should I use?**
A: Any! OpenAI, Gemini, Claude, etc. Just connect your API key in n8n.

**Q: Can I test locally first?**
A: Yes! Replace `https://LynqAtmos2025.onrender.com` with `http://localhost:3000` if running locally.

**Q: What if my classifications are wrong?**
A: The API will tell you how many phishing emails it expected vs. what you submitted. Refine your workflow logic.

**Q: How do I know I got the flag?**
A: You'll receive a response with `"flag": "FLAG{green_signal_secured}"` if all classifications match!

---

**Need help?** Check the n8n documentation: https://docs.n8n.io/
