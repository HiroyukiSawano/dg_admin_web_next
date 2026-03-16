const modules = import.meta.glob('@/**/en/*.js', { eager: true })
const locales = Object.keys(modules).reduce((acc, key) => {
  const module = modules[key]
  if (module && module.default) {
    return { ...acc, ...module.default }
  }
  return acc
}, {})

export default {
  'ec.global.form.search.placeholder': 'Search keywords',
  'ec.global.form.search.text': 'Search',
  'ec.global.form.select.placeholder': 'Select ',
  'ec.global.form.daterange.placeholder': 'Select date range',
  'ec.global.form.daterange.start.placeholder': 'Select start date',
  'ec.global.form.daterange.end.placeholder': 'Select end date',
  'ec.global.button.text.cancel': 'Cancel',
  'ec.global.button.text.confirm': 'Confirm',
  'ec.global.button.text.submit': 'Submit',
  'ec.global.button.text.more': 'More',
  'ec.global.button.text.info': 'Info',
  'ec.global.button.text.other': 'Other',
  'ec.global.button.text.action': 'Action',
  'ec.global.button.text.primary': 'Primary',
  'ec.global.button.text.search': 'Search',
  'ec.global.button.text.reset': 'Reset',

  'ec.retrieval.dialog.title': 'Quick Retrieval',
  'ec.retrieval.dialog.form.input.placeholder': 'Please enter "/" or keywords for quick retrieval',
  'ec.retrieval.dialog.empty.description': 'No retrieval results available',

  'ec.error.notice.404.title': 'Sorry, the page you visited does not exist.',
  'ec.error.notice.404.description': 'Please check if the URL you entered is correct, or click the button below to return to the homepage.',
  'ec.error.notice.500.title': 'Sorry, there was an error on the server.',
  'ec.error.notice.500.description': 'Please try again later, or click the button below to return to the homepage.',
  'ec.error.notice.403.title': 'Sorry, you do not have permission to access this page.',
  'ec.error.notice.403.description': 'The current account does not have operational permissions. Please contact the administrator.',
  'ec.error.notice.button.text': 'Back Home',
  ...locales,
}
