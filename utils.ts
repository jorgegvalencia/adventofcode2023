import fs from 'fs/promises'
import path from 'path'
import os from 'os'

export async function getFileInput (dirname: string, filename: string) {
  const fileContent = await fs.readFile(path.resolve(dirname, filename), { encoding: 'utf8' })
  return fileContent
}

export async function toLines (fileContent: string){
  return fileContent.split(os.EOL)
}

export type Phase = 'one' | 'two'