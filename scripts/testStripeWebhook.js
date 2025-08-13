const https = require('https');

// Test webhook data
const testEvent = {
  id: 'evt_test_webhook',
  object: 'event',
  api_version: '2025-07-30.basil',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'acct_test_123',
      object: 'account',
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true, status: 'active' },
        transfers: { requested: true, status: 'active' }
      },
      charges_enabled: true,
      country: 'US',
      created: Math.floor(Date.now() / 1000),
      default_currency: 'usd',
      details_submitted: true,
      email: 'test@example.com',
      external_accounts: {
        object: 'list',
        data: [],
        has_more: false,
        total_count: 0,
        url: '/v1/accounts/acct_test_123/external_accounts'
      },
      future_requirements: {
        alternatives: [],
        current_deadline: null,
        currently_due: [],
        disabled_reason: null,
        errors: [],
        eventually_due: [],
        past_due: [],
        pending_verification: []
      },
      metadata: {},
      payouts_enabled: true,
      requirements: {
        alternatives: [],
        current_deadline: null,
        currently_due: [],
        disabled_reason: null,
        errors: [],
        eventually_due: [],
        past_due: [],
        pending_verification: []
      },
      settings: {
        bacs_debit_payments: {},
        branding: {
          icon: null,
          logo: null,
          primary_color: null,
          secondary_color: null
        },
        card_issuing: {
          tos_acceptance: {
            date: null,
            ip: null,
            user_agent: null
          }
        },
        card_payments: {
          decline_on: {
            avs_failure: true,
            cvc_failure: true
          },
          statement_descriptor_prefix: null,
          statement_descriptor_prefix_kanji: null,
          statement_descriptor_prefix_kana: null
        },
        dashboard: {
          display_name: null,
          timezone: 'Etc/UTC'
        },
        payments: {
          statement_descriptor: null,
          statement_descriptor_kana: null,
          statement_descriptor_kanji: null
        },
        payouts: {
          debit_negative_balances: true,
          schedule: {
            delay_days: 7,
            interval: 'daily'
          },
          statement_descriptor: null
        },
        sepa_debit_payments: {}
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      type: 'express'
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_webhook',
    idempotency_key: null
  },
  type: 'account.updated'
};

const postData = JSON.stringify(testEvent);

const options = {
  hostname: 'backend-staging.evento-app.io',
  port: 443,
  path: '/stripe-webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Stripe-Signature': 't=1234567890,v1=fake_signature_for_test'
  }
};

console.log('🧪 Testing Stripe webhook endpoint...');
console.log('📡 Sending test event to:', `https://${options.hostname}${options.path}`);
console.log('📊 Event type:', testEvent.type);

const req = https.request(options, (res) => {
  console.log('📡 Response Status:', res.statusCode);
  console.log('📡 Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📡 Response Body:', data);
    console.log('✅ Test completed!');
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.write(postData);
req.end();
