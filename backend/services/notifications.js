import twilio from 'twilio';
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function sendClaimNotification(worker, claim, fraudResult) {
  const phone = `whatsapp:+91${worker.phone}`;
  const from  = 'whatsapp:+14155238886'; // Twilio sandbox number

  let message = '';

  if (fraudResult.verdict === 'approve') {
    message = `✅ GigShield: Your ${claim.claimType} claim for ₹${claim.amountInr} has been APPROVED. Payment will be processed within 24 hours.`;
  } else if (fraudResult.verdict === 'review') {
    message = `⏳ GigShield: Your claim for ₹${claim.amountInr} is under review. We'll notify you within 48 hours.`;
  } else {
    message = `❌ GigShield: Your claim for ₹${claim.amountInr} was rejected. Reason: ${fraudResult.flags.join(', ')}. Contact support if you think this is a mistake.`;
  }

  await client.messages.create({ from, to: phone, body: message });
}
