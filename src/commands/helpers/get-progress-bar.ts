import { filledBar, splitBar } from 'string-progressbar'

export enum ProgressBarType {
  Split,
  Filled
}

export type ProgressBarParams = {
  total: number
  current: number
  type?: ProgressBarType
  size?: number
}

export const getProgressBar = ({
  type = ProgressBarType.Split,
  total,
  current,
  size = 20
}: ProgressBarParams): string => {
  let bar: string[]

  switch (type) {
    case ProgressBarType.Filled: {
      bar = filledBar(total, current, size, '□', '■')
      break
    }

    case ProgressBarType.Split: {
      bar = splitBar(total, current, size, '▬', '🔘')
      break
    }
  }

  return `${bar[1]}${bar[0]}`
}
