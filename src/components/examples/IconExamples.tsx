import { Icon } from '@/components/ui';
import type { IconName } from '@/types';

// Example usage of the Icon component
export function IconExamples() {
  const iconNames: IconName[] = [
    'sun',
    'moon', 
    'github-logo',
    'linkedin-logo',
    'arrow-right',
    'mail'
  ];

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Icon Component Examples</h2>
      
      {/* Basic Usage */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Basic Icons</h3>
        <div className="flex gap-4 items-center">
          {iconNames.map((name) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <Icon name={name} size={24} />
              <span className="text-xs text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Different Sizes */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Different Sizes</h3>
        <div className="flex gap-4 items-center">
          <Icon name="github-logo" size={16} />
          <Icon name="github-logo" size={24} />
          <Icon name="github-logo" size={32} />
          <Icon name="github-logo" size={48} />
        </div>
      </section>

      {/* With Colors */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Colored Icons</h3>
        <div className="flex gap-4 items-center">
          <Icon name="mail" className="text-blue-500" />
          <Icon name="github-logo" className="text-gray-800 dark:text-white" />
          <Icon name="linkedin-logo" className="text-blue-600" />
          <Icon name="sun" className="text-yellow-500" />
          <Icon name="moon" className="text-purple-500" />
        </div>
      </section>

      {/* Interactive Examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Interactive</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            <Icon name="mail" size={16} />
            Contact Me
          </button>
          
          <a 
            href="#" 
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            View on GitHub
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}