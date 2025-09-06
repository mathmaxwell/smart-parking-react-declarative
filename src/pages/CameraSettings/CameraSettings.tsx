import { useLangStore } from '../../language/useTranslationStore'

const CameraSettings = () => {
	const { t } = useLangStore()
	return <div>{t.cameraSettings}</div>
}

export default CameraSettings
