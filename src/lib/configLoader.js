/**
 * Runtime Configuration Loader
 * 
 * Provides safe loading of API endpoint configuration with fallback mechanisms:
 * 1. First tries to load from window.__GROWKSH_RUNTIME_CONFIG__ (from public/runtime-config.js)
 * 2. Falls back to CloudFormation exports if runtime config is empty
 * 3. Falls back to environment variables if CloudFormation is unavailable
 */

/**
 * Get the API URL with automatic fallback mechanism
 * @returns {Promise<string>} The API endpoint URL
 * @throws {Error} If API URL cannot be determined from any source
 */
export async function getApiUrl() {
  // 1. Try runtime config (from public/runtime-config.js)
  const runtimeConfig = typeof window !== 'undefined' && window.__GROWKSH_RUNTIME_CONFIG__
  const runtimeApiUrl = runtimeConfig?.VITE_API_URL?.trim()
  
  if (runtimeApiUrl) {
    console.info('[Config] Using API URL from runtime config:', runtimeApiUrl)
    return runtimeApiUrl
  }

  // 2. Try environment variables (for local development)
  const envApiUrl = import.meta.env.VITE_API_URL?.trim()
  if (envApiUrl) {
    console.info('[Config] Using API URL from environment:', envApiUrl)
    return envApiUrl
  }

  // 3. Try to fetch from CloudFormation exports (runtime fallback)
  try {
    console.warn('[Config] Runtime config is empty, attempting to fetch from CloudFormation...')
    const apiUrl = await fetchApiUrlFromCloudFormation()
    if (apiUrl) {
      console.info('[Config] Using API URL from CloudFormation:', apiUrl)
      // Cache it for future use
      if (runtimeConfig) {
        window.__GROWKSH_RUNTIME_CONFIG__.VITE_API_URL = apiUrl
      }
      return apiUrl
    }
  } catch (error) {
    console.error('[Config] Failed to fetch from CloudFormation:', error)
  }

  // 4. No API URL found anywhere
  const errorMsg = 'API_URL is not configured. For deployments, ensure VITE_API_URL is set in public/runtime-config.js'
  console.error('[Config] ' + errorMsg)
  throw new Error(errorMsg)
}

/**
 * Fetch API URL from CloudFormation exports (runtime fallback)
 * This is a fallback mechanism and requires a Lambda function to be deployed
 * @private
 */
async function fetchApiUrlFromCloudFormation() {
  try {
    // This endpoint should be created as a Lambda function that returns CloudFormation exports
    // For now, we'll skip this as it requires additional infrastructure
    // In a production setup, you'd have:
    // const response = await fetch('/api/config')
    // const config = await response.json()
    // return config.apiEndpoint
    
    // For production, the API URL should always be injected during CI/CD
    return null
  } catch (error) {
    console.error('[Config] CloudFormation fetch error:', error)
    return null
  }
}

/**
 * Get the full runtime configuration
 * @returns {Promise<Object>} The complete runtime configuration
 */
export async function getConfig() {
  const apiUrl = await getApiUrl()
  
  const runtimeConfig = typeof window !== 'undefined' && window.__GROWKSH_RUNTIME_CONFIG__
  return {
    VITE_API_URL: apiUrl,
    VITE_COGNITO_USER_POOL_ID: runtimeConfig?.VITE_COGNITO_USER_POOL_ID || import.meta.env.VITE_COGNITO_USER_POOL_ID,
    VITE_COGNITO_CLIENT_ID: runtimeConfig?.VITE_COGNITO_CLIENT_ID || import.meta.env.VITE_COGNITO_CLIENT_ID,
    VITE_AWS_REGION: runtimeConfig?.VITE_AWS_REGION || import.meta.env.VITE_AWS_REGION || 'ap-south-1',
    VITE_USE_FAKE_AUTH: runtimeConfig?.VITE_USE_FAKE_AUTH || import.meta.env.VITE_USE_FAKE_AUTH || '0',
  }
}

/**
 * Validate that all required configuration is available
 * @returns {Promise<boolean>} True if configuration is valid
 */
export async function validateConfig() {
  try {
    const config = await getConfig()
    
    const required = ['VITE_API_URL', 'VITE_COGNITO_USER_POOL_ID', 'VITE_COGNITO_CLIENT_ID']
    const missing = required.filter(key => !config[key])
    
    if (missing.length > 0) {
      console.error('[Config] Missing required configuration:', missing)
      return false
    }
    
    console.info('[Config] Configuration validation successful')
    return true
  } catch (error) {
    console.error('[Config] Configuration validation failed:', error)
    return false
  }
}
