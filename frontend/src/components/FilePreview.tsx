import React, { useEffect, useRef } from 'react'

import GreenCheck from '../assets/green_check.svg';

import './FilePreview.scss';

export const FilePreview = ({
  imageId,
  file,
}: {
  imageId: string
  file: File
}): React.ReactElement => {
  const fileReaderRef = useRef<FileReader>(new FileReader())

  useEffect(() => {
    const reader = fileReaderRef.current
    reader.readAsDataURL(file)

    return (): void => {
      reader.abort()  // Abort reading if component unmounts or cleanup is triggered
      reader.onloadend = null
    }
  }, [file])

  const { name } = file


  return (
    <div
      data-testid="file-input-preview"
      className="usa-file-input__preview display-flex flex-row"
      aria-hidden="true">
      <img
        id={imageId}
        className='file-preview'
        data-testid="file-input-preview-image"
        src={GreenCheck}
        alt=""
      />
      <p>{name}</p>
    </div>
  )
}
