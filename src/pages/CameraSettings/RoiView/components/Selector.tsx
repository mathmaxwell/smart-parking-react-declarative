import * as React from 'react'
import { useRef, useLayoutEffect } from 'react'

import { areaSelector } from '../js/area-selector.js'

import useCordCache from '../hooks/useCordCache'

import type ICord from '../model/ICord'
import type { ICordInternal } from '../model/ICord'
import lowLevelCords from '../utils/lowLevelCords'
import { Box } from '@mui/material'

interface ISelectorProps {
	src: string
	id: string
	readonly: boolean
	cords: ICord[]
	naturalHeight: number
	naturalWidth: number
	onChange: (cord: ICordInternal) => void
	onClick?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
	onHover?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
}

export const Selector = ({
	src = 'image.png',
	id = 'unset',
	cords: upperCords = [],
	readonly,
	naturalHeight,
	naturalWidth,
	onChange,
	onClick,
	onHover,
}: ISelectorProps) => {
	const parentRef = useRef<HTMLDivElement>(null as never)
	const mountRef = useRef(true)

	const cordManager = useCordCache(upperCords)

	const cords = cordManager.getValue()

	useLayoutEffect(() => {
		const { current } = parentRef
		current.innerHTML = `
      <react-declarative-area-selector
        imageSrc="${src}"
        id="${id}">
      </react-declarative-area-selector>
    `
		const roi = (args: any[]) => {
			const [top, left, right, bottom] = args
			const { current } = mountRef
			if (current) {
				const dto: ICordInternal = {
					type: 'roi',
					id: 'roi',
					top,
					left,
					height: naturalHeight - top - bottom,
					width: naturalWidth - left - right,
					angle: 0,
				}
				cordManager.commitChange(dto)
				onChange(dto)
			}
		}
		const rect = (args: any[]) => {
			const [id, top, left, height, width, angle] = args
			const { current } = mountRef
			if (current) {
				const dto: ICordInternal = {
					type: 'rect',
					id,
					top,
					left,
					height,
					width,
					angle,
				}
				cordManager.commitChange(dto)
				onChange(dto)
			}
		}
		const click = (args: any[]) => {
			const [id, e] = args
			onClick && onClick(e, id)
		}
		const hover = (args: any[]) => {
			const [id, e] = args
			onHover && onHover(e, id)
		}
		areaSelector({
			areaRef: (refId: any, ref: any) => {
				if (refId === id) {
					ref.controls = lowLevelCords(cords, naturalHeight, naturalWidth)
				}
			},
			areaEvent: (refId: any, type: any, ...args: any) => {
				if (refId === id) {
					switch (type) {
						case 'rect-area-changed':
							rect(args)
							break
						case 'roi-area-changed':
							roi(args)
							break
						case 'rect-area-click':
							click(args)
							break
						case 'square-area-click':
							click(args)
							break
						case 'rect-area-hover':
							hover(args)
							break
						case 'square-area-hover':
							hover(args)
							break
						case 'root-area-hover':
							hover(args)
							break
						default:
							throw new Error('Selector unknown event type')
					}
				}
			},
			readonlyFlag: readonly,
		})
		mountRef.current = true
		return () => {
			mountRef.current = false
		}
	}, [src, id, cords])

	return (
		<Box sx={{ position: 'relative' }} ref={parentRef}>
			<img src={src} />
		</Box>
	)
}

export default Selector
