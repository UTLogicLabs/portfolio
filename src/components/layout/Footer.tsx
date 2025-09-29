import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Icon } from '@/components/ui';

export function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };
  return (
    <footer id="contact" className="w-full py-12 md:py-24 bg-background border-t">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold">Joshua Dix</h3>
            <p className="mt-2 text-muted-foreground">
              Senior Software Engineer
            </p>
            <p className="mt-4 max-w-[400px] text-muted-foreground">
              Building innovative web solutions with a focus on performance,
              accessibility, and user experience.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="github-logo" size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="linkedin-logo" size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="twitter" size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="mailto:josh.dix@theblindman.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="mail" size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Contact Me</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Name
                </label>
                <input 
                  id="name" 
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Your name" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Your email" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium leading-none">
                  Message
                </label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Your message" 
                  required
                />
              </div>
              <button 
                type="submit" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Joshua Dix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}