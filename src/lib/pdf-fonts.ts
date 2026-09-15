import interRegular from '@/assets/fonts/inter-regular.ttf?url'
import interBold from '@/assets/fonts/inter-bold.ttf?url'
import interItalic from '@/assets/fonts/inter-italic.ttf?url'
import interBoldItalic from '@/assets/fonts/inter-bolditalic.ttf?url'
import robotoRegular from '@/assets/fonts/roboto-regular.ttf?url'
import robotoBold from '@/assets/fonts/roboto-bold.ttf?url'
import robotoItalic from '@/assets/fonts/roboto-italic.ttf?url'
import robotoBoldItalic from '@/assets/fonts/roboto-bolditalic.ttf?url'
import ibmPlexSansRegular from '@/assets/fonts/ibmplexsans-regular.ttf?url'
import ibmPlexSansBold from '@/assets/fonts/ibmplexsans-bold.ttf?url'
import ibmPlexSansItalic from '@/assets/fonts/ibmplexsans-italic.ttf?url'
import ibmPlexSansBoldItalic from '@/assets/fonts/ibmplexsans-bolditalic.ttf?url'
import sourceSans3Regular from '@/assets/fonts/sourcesans3-regular.ttf?url'
import sourceSans3Bold from '@/assets/fonts/sourcesans3-bold.ttf?url'
import sourceSans3Italic from '@/assets/fonts/sourcesans3-italic.ttf?url'
import sourceSans3BoldItalic from '@/assets/fonts/sourcesans3-bolditalic.ttf?url'
import arimoRegular from '@/assets/fonts/arimo-regular.ttf?url'
import arimoBold from '@/assets/fonts/arimo-bold.ttf?url'
import arimoItalic from '@/assets/fonts/arimo-italic.ttf?url'
import arimoBoldItalic from '@/assets/fonts/arimo-bolditalic.ttf?url'
import carlitoRegular from '@/assets/fonts/carlito-regular.ttf?url'
import carlitoBold from '@/assets/fonts/carlito-bold.ttf?url'
import carlitoItalic from '@/assets/fonts/carlito-italic.ttf?url'
import carlitoBoldItalic from '@/assets/fonts/carlito-bolditalic.ttf?url'
import tinosRegular from '@/assets/fonts/tinos-regular.ttf?url'
import tinosBold from '@/assets/fonts/tinos-bold.ttf?url'
import tinosItalic from '@/assets/fonts/tinos-italic.ttf?url'
import tinosBoldItalic from '@/assets/fonts/tinos-bolditalic.ttf?url'
import gelasioRegular from '@/assets/fonts/gelasio-regular.ttf?url'
import gelasioBold from '@/assets/fonts/gelasio-bold.ttf?url'
import gelasioItalic from '@/assets/fonts/gelasio-italic.ttf?url'
import gelasioBoldItalic from '@/assets/fonts/gelasio-bolditalic.ttf?url'
import cmuSerifRegular from '@/assets/fonts/cmuserif-regular.ttf?url'
import cmuSerifBold from '@/assets/fonts/cmuserif-bold.ttf?url'
import cmuSerifItalic from '@/assets/fonts/cmuserif-italic.ttf?url'
import cmuSerifBoldItalic from '@/assets/fonts/cmuserif-bolditalic.ttf?url'

interface FontFiles {
  normal: string
  bold: string
  italic: string
  bolditalic: string
}

const FONT_FILES: Record<string, FontFiles> = {
  inter: { normal: interRegular, bold: interBold, italic: interItalic, bolditalic: interBoldItalic },
  roboto: { normal: robotoRegular, bold: robotoBold, italic: robotoItalic, bolditalic: robotoBoldItalic },
  ibmplexsans: { normal: ibmPlexSansRegular, bold: ibmPlexSansBold, italic: ibmPlexSansItalic, bolditalic: ibmPlexSansBoldItalic },
  sourcesans3: { normal: sourceSans3Regular, bold: sourceSans3Bold, italic: sourceSans3Italic, bolditalic: sourceSans3BoldItalic },
  arimo: { normal: arimoRegular, bold: arimoBold, italic: arimoItalic, bolditalic: arimoBoldItalic },
  carlito: { normal: carlitoRegular, bold: carlitoBold, italic: carlitoItalic, bolditalic: carlitoBoldItalic },
  tinos: { normal: tinosRegular, bold: tinosBold, italic: tinosItalic, bolditalic: tinosBoldItalic },
  gelasio: { normal: gelasioRegular, bold: gelasioBold, italic: gelasioItalic, bolditalic: gelasioBoldItalic },
  cmuserif: { normal: cmuSerifRegular, bold: cmuSerifBold, italic: cmuSerifItalic, bolditalic: cmuSerifBoldItalic },
}

const cache = new Map<string, string>()

async function fetchAsBase64(url: string) {
  if (cache.has(url)) return cache.get(url)!
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  cache.set(url, base64)
  return base64
}

export async function embedFont(doc: any, family: string) {
  const files = FONT_FILES[family]
  if (!files) return false

  const styles: Array<[keyof FontFiles, string]> = [
    ['normal', 'normal'],
    ['bold', 'bold'],
    ['italic', 'italic'],
    ['bolditalic', 'bolditalic'],
  ]

  for (const [key, style] of styles) {
    const base64 = await fetchAsBase64(files[key])
    const fileName = `${family}-${style}.ttf`
    doc.addFileToVFS(fileName, base64)
    doc.addFont(fileName, family, style)
  }

  return true
}
