import yahooFinance from 'yahoo-finance2';

async function run() {
    try {
        console.log("Fetching ^JKSE...");
        const quote = await yahooFinance.quote('^JKSE');
        console.log('Success:');
        console.log('Price:', quote.regularMarketPrice);
        console.log('Change:', quote.regularMarketChangePercent);
        console.log('Time:', quote.regularMarketTime);
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
