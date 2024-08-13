import React, { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'

const SPACER_GIF =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const FilePreview = ({
  imageId,
  file,
}: {
  imageId: string
  file: File
}): React.ReactElement => {
  const fileReaderRef = useRef<FileReader>(new FileReader())
  const [isLoading, setIsLoading] = useState(true)
  const [previewSrc, setPreviewSrc] = useState(SPACER_GIF)
  const [showGenericPreview, setShowGenericPreview] = useState(false)

  useEffect(() => {
    const reader = fileReaderRef.current

    const handleLoadEnd = (): void => {
      setIsLoading(false)
      setPreviewSrc(reader.result as string)
    }

    reader.onloadend = handleLoadEnd
    reader.readAsDataURL(file)

    return (): void => {
      reader.abort()  // Abort reading if component unmounts or cleanup is triggered
      reader.onloadend = null
    }
  }, [file])

  const { name } = file

  const onImageError = (): void => {
    setPreviewSrc(SPACER_GIF)
    setShowGenericPreview(true)
  }

  const isPDF = name.endsWith('.pdf')
  const isWord = name.endsWith('.doc') || name.endsWith('.pages')
  const isVideo = name.endsWith('.mov') || name.endsWith('.mp4')
  const isExcel = name.endsWith('.xls') || name.endsWith('.numbers')
  const isGeneric = !isPDF && !isWord && !isVideo && !isExcel

  const imageClasses = classnames('usa-file-input__preview-image', {
    'is-loading': isLoading,
    'usa-file-input__preview-image--pdf': showGenericPreview && isPDF,
    'usa-file-input__preview-image--word': showGenericPreview && isWord,
    'usa-file-input__preview-image--video': showGenericPreview && isVideo,
    'usa-file-input__preview-image--excel': showGenericPreview && isExcel,
    'usa-file-input__preview-image--generic': showGenericPreview && isGeneric,
  })

  return (
    <div
      data-testid="file-input-preview"
      className="usa-file-input__preview"
      aria-hidden="true">
      <img
        id={imageId}
        data-testid="file-input-preview-image"
        src={previewSrc}
        alt=""
        className={imageClasses}
        onError={onImageError}
      />
      {name}
    </div>
  )
}
