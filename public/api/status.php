<?php
/**
 * BetterStack Status API Proxy
 * Place this file in: /var/www/jexactyl/public/api/status.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Your BetterStack API token
$apiToken = 'GezDNGwHktAdcqBrEYLd6GwA';

// First, we need to get your status page ID
// You can find it by visiting: https://uptime.betterstack.com/api/v2/status-pages
// with your API token

// For now, let's fetch all status pages and use the first one
$ch = curl_init();

// Fetch all status pages
curl_setopt($ch, CURLOPT_URL, 'https://uptime.betterstack.com/api/v2/status-pages');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiToken,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode([
        'status' => 'operational',
        'error' => 'Failed to fetch status',
        'fallback' => true
    ]);
    curl_close($ch);
    exit;
}

$data = json_decode($response, true);

// Check if we got data
if (!isset($data['data']) || empty($data['data'])) {
    http_response_code(500);
    echo json_encode([
        'status' => 'operational',
        'error' => 'No status pages found',
        'fallback' => true
    ]);
    curl_close($ch);
    exit;
}

// Get the first status page's aggregate state
$statusPage = $data['data'][0];
$aggregateState = $statusPage['attributes']['aggregate_state'] ?? 'operational';

curl_close($ch);

// Return the status
echo json_encode([
    'status' => $aggregateState,
    'page_id' => $statusPage['id'],
    'company_name' => $statusPage['attributes']['company_name'] ?? 'Unknown',
    'fallback' => false
]);