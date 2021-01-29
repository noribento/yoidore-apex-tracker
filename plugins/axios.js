export default function ({ $axios }) {
  $axios.onRequest((config) => {
    $axios.defaults.headers.common['TRN-Api-Key'] = process.env.API_KEY
  })
}
