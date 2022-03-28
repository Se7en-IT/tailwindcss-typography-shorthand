const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addComponents, e, config }) {
    const prefix = "typog"
    const fontSizes = Object.entries(config('theme.fontSize'))
    const fontWeights = Object.entries(config('theme.fontWeight'))
    const fontFamilies = Object.entries(config('theme.fontFamily'))
    const rules = fontSizes.reduce((memo, [sizeKey, sizeValue]) => {
        fontWeights.forEach(([weightKey, weightValue]) => {
            const baseStyle = {
                fontSize: Array.isArray(sizeValue) ? sizeValue[0] : sizeValue,
                fontWeight: weightValue
            }
            if (Array.isArray(sizeValue)) {
                baseStyle.lineHeight = sizeValue[1]
            }
            memo[`.${e(`${prefix}-${sizeKey}-${weightKey}`)}`] = baseStyle
            fontFamilies.forEach(([familyKey, familyValue]) => {
                memo[`.${e(`${prefix}-${sizeKey}-${weightKey}-${familyKey}`)}`] = {
                    ...baseStyle,
                    fontFamily: Array.isArray(familyValue) ? familyValue.join(', ') : familyValue
                }
            })
        })
        return memo
    }, {})
    addComponents(rules)
})