export async function resizeImageToDataUrl(file: File, size = 256, quality = 0.82): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.size > 5_000_000) throw new Error('Image must be smaller than 5 MB.')

  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the image.'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onerror = () => reject(new Error('Could not decode the image.'))
    img.onload = () => resolve(img)
    img.src = source
  })

  const scale = Math.max(size / image.width, size / image.height)
  const width = image.width * scale
  const height = image.height * scale
  const offsetX = (size - width) / 2
  const offsetY = (size - height) / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Image processing is not supported in this browser.')
  ctx.drawImage(image, offsetX, offsetY, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}
