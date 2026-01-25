// Test script to verify Supabase database connection and table structure
import { supabase } from '../services/supabaseClient.js';

async function testDatabaseConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    console.log('✅ Supabase connection successful');

    // Test tables existence
    const tables = ['users', 'user_stats', 'user_badges', 'badges', 'user_activity_log', 'challenges', 'challenge_participant', 'activities', 'points_log'];

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.log(`❌ Table '${table}' error:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}' does not exist or access denied`);
      }
    }

  } catch (err) {
    console.error('❌ Database test failed:', err);
  }
}

testDatabaseConnection();