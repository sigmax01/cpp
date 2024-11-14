export function analysis() {
    const isLocal = process.env.NODE_ENV === 'development'
    if (isLocal) {
      return []
    }
    return [
      [
        'script',
        {
          src: 'https://umami.ricolxwz.io/script.js',
          defer: true,
          'data-website-id': '428fe69a-245a-4a8c-937b-97369fc9a31b'
        }
      ]
    ]
  }