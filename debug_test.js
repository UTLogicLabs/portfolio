// Simple debug test to check if file validation is working
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploader } from './src/components/admin/ImageUploader';

const mockFn = () => {};
render(<ImageUploader onImageSelected={mockFn} />);

const input = screen.getByLabelText(/browse/i);
const file = new File(['test'], 'test.txt', { type: 'text/plain' });

console.log('Before file upload');
console.log('DOM:', document.body.innerHTML);

await userEvent.setup().upload(input, file);

console.log('After file upload');  
console.log('DOM:', document.body.innerHTML);
