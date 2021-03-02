import '../src/renderer/style/index.scss'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'main',
    values: [
      { name: 'main', value: '#052437', default: true }
    ],
  },
}
