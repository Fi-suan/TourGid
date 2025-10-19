const { withAndroidManifest, withGradleProperties } = require('expo/config-plugins');

const withAndroidXFix = (config) => {
  // Add AndroidX and Jetifier properties
  config = withGradleProperties(config, (config) => {
    const gradleProperties = config.modResults;
    
    // Ensure AndroidX is enabled
    gradleProperties.push({
      type: 'property',
      key: 'android.useAndroidX',
      value: 'true',
    });
    
    // Enable Jetifier to automatically migrate support libraries
    gradleProperties.push({
      type: 'property',
      key: 'android.enableJetifier',
      value: 'true',
    });
    
    return config;
  });
  
  // Fix AndroidManifest conflicts
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application;
    
    if (!mainApplication || mainApplication.length === 0) {
      return config;
    }
    
    const application = mainApplication[0];
    
    // Add tools namespace if not present
    if (!androidManifest.manifest.$) {
      androidManifest.manifest.$ = {};
    }
    androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    
    // Set appComponentFactory to AndroidX version
    if (!application.$) {
      application.$ = {};
    }
    
    // First, set the actual value
    application.$['android:appComponentFactory'] = 'androidx.core.app.CoreComponentFactory';
    
    // Then add tools:replace to override conflicts
    const existingReplace = application.$['tools:replace'];
    const replaceValue = 'android:appComponentFactory';
    
    if (existingReplace) {
      if (!existingReplace.includes(replaceValue)) {
        application.$['tools:replace'] = `${existingReplace},${replaceValue}`;
      }
    } else {
      application.$['tools:replace'] = replaceValue;
    }
    
    return config;
  });
  
  return config;
};

module.exports = withAndroidXFix;

