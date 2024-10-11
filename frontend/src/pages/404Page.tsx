import React from 'react';
import image from '../../public/svgs/404.svg'

const NotFound: React.FC = () => {
  return (
    <div className="width-full height-full display-flex flex-justify-center">
        <img data-testid='404-image' src={image} alt="404" />
    </div>
  );
};

export default NotFound;
