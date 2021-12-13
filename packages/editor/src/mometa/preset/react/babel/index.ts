export default function mometaBabelReactPreset() {
  return {
    plugins: [[require.resolve('./inject'), {}]]
  }
}
