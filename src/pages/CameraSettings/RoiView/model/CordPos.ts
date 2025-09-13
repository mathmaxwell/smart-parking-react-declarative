import { rect, roi } from '../js/rio'

export type RectPos = ReturnType<typeof rect>
export type RoiPos = ReturnType<typeof roi>

export type CordPos = RectPos | RoiPos
