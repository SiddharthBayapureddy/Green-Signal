const fs = require('fs');
const path = require('path');

// Load the correct answer
const challengeData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/red-gate-feed.json'), 'utf8')
);

const FLAG = 'FLAG{red_gate_defended}';
const CORRECT_USERS = challengeData.correct_answer.users_to_lock.sort();

/**
 * Validates if the player's agent correctly identified brute-force attackers
 * @param {Object} submission - Player's submission
 * @param {Array} submission.users - List of user IDs to lock
 * @param {String} submission.reasoning - Explanation for the decision
 * @returns {Object} Validation result with flag if correct
 */
function validateRedGate(submission) {
  // Check if submission has required fields
  if (!submission.users || !submission.reasoning) {
    return {
      success: false,
      message: 'Missing required fields: users and reasoning',
      hint: 'Your agent must provide both a list of users to lock and reasoning'
    };
  }

  // Normalize the submitted users list
  const submittedUsers = Array.isArray(submission.users) 
    ? submission.users.map(u => u.toLowerCase().trim()).sort()
    : [];

  // Check if users list is empty
  if (submittedUsers.length === 0) {
    return {
      success: false,
      message: 'No users submitted',
      hint: 'Analyze the login attempts to find users with brute-force patterns'
    };
  }

  // Check if reasoning is provided and substantial
  if (!submission.reasoning || submission.reasoning.trim().length < 10) {
    return {
      success: false,
      message: 'Reasoning is too short or missing',
      hint: 'Your agent must explain WHY these users were flagged (minimum 10 characters)'
    };
  }

  // Check if the correct users were identified
  const isCorrect = JSON.stringify(submittedUsers) === JSON.stringify(CORRECT_USERS);

  if (isCorrect) {
    return {
      success: true,
      message: '🎉 Correct! Your agent successfully identified the brute-force attackers!',
      flag: FLAG,
      users_locked: submittedUsers,
      reasoning: submission.reasoning
    };
  } else {
    // Provide hints based on what they got wrong
    const missing = CORRECT_USERS.filter(u => !submittedUsers.includes(u));
    const extra = submittedUsers.filter(u => !CORRECT_USERS.includes(u));

    let hint = 'Incorrect users identified. ';
    if (missing.length > 0) {
      hint += `You missed ${missing.length} attacker(s). `;
    }
    if (extra.length > 0) {
      hint += `You flagged ${extra.length} innocent user(s). `;
    }
    hint += 'Look for users with 3+ consecutive failed login attempts.';

    return {
      success: false,
      message: 'Incorrect identification',
      hint: hint,
      your_answer: submittedUsers,
      expected_count: CORRECT_USERS.length
    };
  }
}

module.exports = { validateRedGate };
