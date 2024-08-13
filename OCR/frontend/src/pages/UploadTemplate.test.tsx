import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UploadTemplate } from './UploadTemplate';

describe('UploadTemplate component', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<UploadTemplate />);
    expect(asFragment()).toMatchSnapshot();
  });
});
