// Quick test script to verify GeoServer connection and CORS
// Run this with: node test-geoserver.js

const testGeoServerConnection = async () => {
  const baseUrl = 'http://localhost:8080/geoserver';
  
  console.log('Testing GeoServer connection...');
  console.log('Base URL:', baseUrl);
  
  // Test 1: Basic connectivity
  try {
    const response = await fetch(`${baseUrl}/ows?service=WFS&version=1.0.0&request=GetCapabilities`);
    console.log('✅ Basic connectivity: OK');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.log('❌ Basic connectivity: FAILED');
    console.log('Error:', error.message);
  }
  
  // Test 2: CORS preflight
  try {
    const response = await fetch(`${baseUrl}/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_state_boundary&maxFeatures=1&outputFormat=application/json`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5174',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS preflight: OK');
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('  Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
  } catch (error) {
    console.log('❌ CORS preflight: FAILED');
    console.log('Error:', error.message);
  }
  
  // Test 3: Actual data fetch
  try {
    const response = await fetch(`${baseUrl}/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_state_boundary&maxFeatures=1&outputFormat=application/json`);
    const data = await response.json();
    console.log('✅ Data fetch: OK');
    console.log('Features count:', data.features?.length || 0);
  } catch (error) {
    console.log('❌ Data fetch: FAILED');
    console.log('Error:', error.message);
  }
};

// Run the test
testGeoServerConnection().catch(console.error);
