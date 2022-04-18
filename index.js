const plugin = require('tailwindcss/plugin')

function addFamilies(fontFamilies, e, basePrefix, baseStyle){
    const memo = {}
    memo[`.${e(basePrefix)}`] = baseStyle
    fontFamilies.forEach(([familyKey, familyValue]) => {
        memo[`.${e(`${basePrefix}-${familyKey}`)}`] = {
            ...baseStyle,
            fontFamily: Array.isArray(familyValue) ? familyValue.join(', ') : familyValue
        }
    })
    return memo
}

module.exports = plugin(function ({ addComponents, e, config }) {
    const prefix = "typog"
    const fontSizes = Object.entries(config('theme.fontSize'))
    const fontWeights = Object.entries(config('theme.fontWeight'))
    const fontFamilies = Object.entries(config('theme.fontFamily'))
    const letterSpacing = Object.entries(config('theme.letterSpacing'))
    const rules = fontSizes.reduce((memo, [sizeKey, sizeValue]) => {
        fontWeights.forEach(([weightKey, weightValue]) => {
            const basePrefix = `${prefix}-${sizeKey}-${weightKey}`; 
            const baseStyle = {
                fontSize: Array.isArray(sizeValue) ? sizeValue[0] : sizeValue,
                fontWeight: weightValue
            }
            if (Array.isArray(sizeValue)) {
                baseStyle.lineHeight = sizeValue[1]
            }
            memo = {
                ...memo,
                ...addFamilies(fontFamilies, e, basePrefix, baseStyle)
            }
            letterSpacing.forEach(([letterSpacingKey, letterSpacingValue]) => {
                const innerBasePrefix = `${basePrefix}-${letterSpacingKey}`;
                const innerBaseStyle = {
                    ...baseStyle,
                    letterSpacing: letterSpacingValue
                }
                memo = {
                    ...memo,
                    ...addFamilies(fontFamilies, e, innerBasePrefix, innerBaseStyle)
                }
            })
        })
        return memo
    }, {})
    addComponents(rules)
})