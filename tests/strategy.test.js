/**
 * Simple tests for BlackjackStrategy
 * Run with: node tests/strategy.test.js
 */

const BlackjackStrategy = require('../src/processing/strategy');

console.log('🧪 Testing Blackjack Strategy...\n');

const strategy = new BlackjackStrategy();
let passed = 0;
let failed = 0;

function test(description, playerCards, dealerCard, expected) {
  const result = strategy.getAdvice(playerCards, dealerCard);
  const success = result === expected;
  
  if (success) {
    console.log(`✅ PASS: ${description}`);
    console.log(`   Player: [${playerCards.join(', ')}] | Dealer: ${dealerCard} => ${result}\n`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${description}`);
    console.log(`   Player: [${playerCards.join(', ')}] | Dealer: ${dealerCard}`);
    console.log(`   Expected: ${expected}, Got: ${result}\n`);
    failed++;
  }
}

// Test hard totals
test('Hard 16 vs Dealer 10 should Hit', [10, 6], 10, 'Hit');
test('Hard 17 should Stand', [10, 7], 10, 'Stand');
test('Hard 11 should Double', [6, 5], 7, 'Double');
test('Hard 10 vs Dealer 9 should Double', [6, 4], 9, 'Double');
test('Hard 12 vs Dealer 5 should Stand', [7, 5], 5, 'Stand');

// Test soft totals
test('Soft 18 (A,7) vs Dealer 9 should Hit', [11, 7], 9, 'Hit');
test('Soft 17 (A,6) vs Dealer 5 should Double', [11, 6], 5, 'Double');

// Test pairs
test('Pair of 8s should Split', [8, 8], 10, 'Split');
test('Pair of Aces should Split', [11, 11], 9, 'Split');
test('Pair of 10s should Stand', [10, 10], 6, 'Stand');

// Test total calculation
console.log('\n🧮 Testing hand total calculations...\n');

function testTotal(description, cards, expected) {
  const result = strategy.calculateTotal(cards);
  const success = result === expected;
  
  if (success) {
    console.log(`✅ PASS: ${description} = ${result}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${description}`);
    console.log(`   Expected: ${expected}, Got: ${result}`);
    failed++;
  }
}

testTotal('Simple total [10, 5]', [10, 5], 15);
testTotal('Ace as 11 [11, 8]', [11, 8], 19);
testTotal('Ace as 1 [11, 10, 5]', [11, 10, 5], 16);
testTotal('Multiple Aces [11, 11, 9]', [11, 11, 9], 21);

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Summary:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Total: ${passed + failed}\n`);

if (failed === 0) {
  console.log('🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed.\n');
  process.exit(1);
}
