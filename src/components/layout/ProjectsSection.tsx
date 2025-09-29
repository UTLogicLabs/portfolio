import { Icon } from '@/components/ui';

export function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment processing.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      github: 'https://github.com',
      demo: 'https://example.com'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A productivity application for managing tasks and projects. Built with React and Firebase, featuring real-time updates, task assignment, and progress tracking.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'Firebase', 'Tailwind CSS', 'TypeScript'],
      github: 'https://github.com',
      demo: 'https://example.com'
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'A weather application that displays current and forecasted weather conditions based on user location. Integrates with multiple weather APIs for accurate data.',
      image: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'OpenWeather API', 'Chart.js', 'Geolocation API'],
      github: 'https://github.com',
      demo: 'https://example.com'
    },
    {
      id: 4,
      title: 'Social Media Analytics Tool',
      description: 'A dashboard for tracking and analyzing social media metrics across multiple platforms. Features data visualization, scheduled reports, and trend analysis.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'D3.js', 'Node.js', 'Social Media APIs'],
      github: 'https://github.com',
      demo: 'https://example.com'
    }
  ];

  return (
    <section id="projects" className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Projects
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Explore some of my recent work and technical projects
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="object-cover w-full h-full transition-transform group-hover:scale-105" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    <Icon name="github-logo" size={16} className="mr-1" />
                    Source Code
                  </a>
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    <Icon name="external-link" size={16} className="mr-1" />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Icon name="code" size={16} className="mr-2" />
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}