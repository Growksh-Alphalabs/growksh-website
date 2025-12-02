export function formatCurrency(amount, locale = 'en-IN', currency = 'INR'){
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function shortText(text, limit = 140){
  if(!text) return ''
  return text.length > limit ? text.slice(0, limit) + '...' : text
}
