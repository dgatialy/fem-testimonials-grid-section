const StyleDictionaryPackage = require('style-dictionary')
const ptr = (px) => {
    return 1/16 * parseFloat(px)
}
// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
  name: 'css/variables',
  formatter: function (dictionary, config) {      
    return `${this.selector} {
        ${dictionary.allProperties
          .map((prop) => `  --${dictionary.options.theme}-${prop.name}: ${prop.value};`)
          .join('\n')}
      }`
  },
})

StyleDictionaryPackage.registerTransform({
  name: 'sizes/rem',
  type: 'value',
  matcher: function (prop) {        
    return [      
      'spacing',      
      'borderRadius',
      'borderWidth',
      'sizing',
      'padding'
    ].includes(prop.original.type) || [            
        'fontSize',
        'paragraphSpacing',
        'lineHeight',
        'letterSpacing'
      ].includes(prop.attributes.type)
  },
  transformer: function (prop) {        
    if (isNaN(parseFloat(prop.original.value))) return prop.original.value;

    return ptr(prop.original.value) + 'rem';        
  },
})

StyleDictionaryPackage.registerTransform({
    name: 'font/weight',
    type: 'value',
    matcher: function (prop) {
        return [            
            'fontWeight',
          ].includes(prop.attributes.type)
    },
    transformer: function (prop) {
        console.log(prop)
        const mapping = { 
            'SemiBold' : 600,
            'Medium': 500            
        }
        
        return mapping[prop.original.value] ? mapping[prop.original.value] : prop.original.value
    },
  })

function getStyleDictionaryConfig(theme) {
  return {
    source: [`tokens/${theme}.json`],
    platforms: {
      web: {
        transforms: ['attribute/cti', 'name/cti/kebab', 'sizes/rem', 'font/weight'],
        buildPath: `output/`,
        files: [
          {
            destination: `${theme}.scss`,
            format: 'scss/variables',
            selector: `:root`,
            options: {
                theme: theme
            }
          },
        ],
      },
    },
  }
}

console.log('Build started...')

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

;['card', 'global'].map(function (theme) {
  console.log('\n==============================================')
  console.log(`\nProcessing: [${theme}]`)

  const StyleDictionary = StyleDictionaryPackage.extend(
    getStyleDictionaryConfig(theme)
  )

  StyleDictionary.buildPlatform('web')

  console.log('\nEnd processing')
})

console.log('\n==============================================')
console.log('\nBuild completed!')
