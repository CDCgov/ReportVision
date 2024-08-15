import React from 'react';
import { UploadHeader } from '../componets/Header';
import Sidebar from '../componets/Sidebar';
import { LABELS } from '../constants/labels';

const AnnotateTemplate: React.FC = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', width: '100%', height: '100%', padding: '16px 8px, 8px, 8px' }}>
      <UploadHeader />
      <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)' }}>
  <Sidebar labels={LABELS} />
  <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
    <div data-testid='annotate-container'>
      Annotation Container will go here
    </div>
  </div>
</div>
    </div>
  );
};

export default AnnotateTemplate;


