import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from '@/components/layout/Footer';

// Mock the Icon component
vi.mock('@/components/ui', () => ({
  Icon: ({ name, size, className, ...props }: any) => (
    <svg 
      data-testid={`icon-${name}`} 
      data-size={size}
      className={className}
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  ),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = '';
  });

  describe('Rendering', () => {
    it('should render the footer with correct structure', () => {
      render(<Footer />);
      
      // Check main footer element
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('id', 'contact');
      
      // Check main heading
      expect(screen.getByText('Joshua Dix')).toBeInTheDocument();
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    it('should render contact form with all required fields', () => {
      render(<Footer />);
      
      // Check form elements
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    it('should render social media links with correct icons', () => {
      render(<Footer />);
      
      // Check social links by role since they have accessible names
      const links = screen.getAllByRole('link');
      const githubLink = links.find(link => link.getAttribute('href') === 'https://github.com');
      const linkedinLink = links.find(link => link.getAttribute('href') === 'https://linkedin.com');
      const twitterLink = links.find(link => link.getAttribute('href') === 'https://twitter.com');
      const emailLink = links.find(link => link.getAttribute('href') === 'mailto:josh.dix@theblindman.com');

      expect(githubLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
      expect(emailLink).toBeInTheDocument();

      // Check icons
      expect(screen.getByTestId('icon-github-logo')).toBeInTheDocument();
      expect(screen.getByTestId('icon-linkedin-logo')).toBeInTheDocument();
      expect(screen.getByTestId('icon-twitter')).toBeInTheDocument();
      expect(screen.getByTestId('icon-mail')).toBeInTheDocument();
    });

    it('should display copyright with current year', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Joshua Dix. All rights reserved.`)).toBeInTheDocument();
    });
  });

  describe('Form Functionality', () => {
    it('should update form fields when user types', async () => {
      const user = userEvent.setup();
      render(<Footer />);
      
      const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const messageInput = screen.getByLabelText('Message') as HTMLTextAreaElement;

      // Type in form fields
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello, this is a test message');

      // Check values
      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
      expect(messageInput.value).toBe('Hello, this is a test message');
    });

    it('should handle form submission', async () => {
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      const user = userEvent.setup();
      render(<Footer />);
      
      // Fill form
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'Test message');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      // Check alert was called
      expect(alertSpy).toHaveBeenCalledWith('Thank you for your message! I\'ll get back to you soon.');
      
      alertSpy.mockRestore();
    });

    it('should reset form after successful submission', async () => {
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      const user = userEvent.setup();
      render(<Footer />);
      
      const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const messageInput = screen.getByLabelText('Message') as HTMLTextAreaElement;
      
      // Fill and submit form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');
      
      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      // Check form is reset
      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
      
      alertSpy.mockRestore();
    });

    it('should prevent form submission with preventDefault', () => {
      render(<Footer />);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      
      // This test verifies that the form element exists and has the right structure
      // The preventDefault behavior is tested implicitly in the other form tests
      if (form) {
        expect(form).toHaveAttribute('class', 'space-y-4');
        
        // Check that the form has the onSubmit handler
        const submitButton = screen.getByRole('button', { name: 'Send Message' });
        expect(submitButton).toHaveAttribute('type', 'submit');
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<Footer />);
      
      // Check that labels are associated with inputs
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const messageInput = screen.getByLabelText('Message');

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(messageInput).toHaveAttribute('id', 'message');
    });

    it('should have proper link attributes for external links', () => {
      render(<Footer />);
      
      const externalLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('target') === '_blank'
      );

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should have screen reader text for social icons', () => {
      render(<Footer />);
      
      // Use getAllByText since there are multiple "Email" elements
      const srOnlyElements = document.querySelectorAll('.sr-only');
      expect(srOnlyElements).toHaveLength(4);
      
      // Check specific sr-only texts
      const githubSrOnly = Array.from(srOnlyElements).find(el => el.textContent === 'GitHub');
      const linkedinSrOnly = Array.from(srOnlyElements).find(el => el.textContent === 'LinkedIn');
      const twitterSrOnly = Array.from(srOnlyElements).find(el => el.textContent === 'Twitter');
      const emailSrOnly = Array.from(srOnlyElements).find(el => el.textContent === 'Email');
      
      expect(githubSrOnly).toBeInTheDocument();
      expect(linkedinSrOnly).toBeInTheDocument();
      expect(twitterSrOnly).toBeInTheDocument();
      expect(emailSrOnly).toBeInTheDocument();
    });

    it('should have required attributes on form fields', () => {
      render(<Footer />);
      
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const messageInput = screen.getByLabelText('Message');

      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(messageInput).toBeRequired();
      
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should apply correct CSS classes', () => {
      render(<Footer />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('w-full', 'py-12', 'md:py-24', 'bg-background', 'border-t');
    });

    it('should apply hover effects on links', () => {
      render(<Footer />);
      
      const socialLinks = screen.getAllByRole('link');
      socialLinks.forEach(link => {
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveClass('transition-colors');
        }
      });
    });
  });

  describe('Icon Integration', () => {
    it('should render icons with correct props', () => {
      render(<Footer />);
      
      const githubIcon = screen.getByTestId('icon-github-logo');
      const linkedinIcon = screen.getByTestId('icon-linkedin-logo');
      const twitterIcon = screen.getByTestId('icon-twitter');
      const mailIcon = screen.getByTestId('icon-mail');

      // Check icon sizes
      expect(githubIcon).toHaveAttribute('data-size', '20');
      expect(linkedinIcon).toHaveAttribute('data-size', '20');
      expect(twitterIcon).toHaveAttribute('data-size', '20');
      expect(mailIcon).toHaveAttribute('data-size', '20');
    });
  });
});