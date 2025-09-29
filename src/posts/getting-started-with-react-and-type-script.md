React + TypeScript with Vite: A Beginner’s Guide

Starting a React project with TypeScript is straightforward, especially using Vite. In this guide we’ll walk through creating a new React + TypeScript app with Vite and cover the basics of writing React components in TypeScript. We’ll look at typing props, managing state, handling events, and some JSX-specific TypeScript gotchas. Throughout, we’ll cite official sources to ensure accuracy (see React docs and TypeScript docs for more details).

1. Set Up a New Project with Vite

Vite offers a quick way to scaffold a React + TypeScript project. Open your terminal and run:

npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev

This uses Vite’s create tool to generate a React app pre-configured for TypeScript. The command npm create vite@latest my-react-app -- --template react-ts sets up a new project named my-react-app using the React+TypeScript template ￼. After installing dependencies (npm install), start the development server with npm run dev. By default Vite will serve the app at http://localhost:5173, where you should see a basic React welcome page.

2. TypeScript and JSX

In the generated project, you’ll write React components in .tsx files. Every file containing JSX must use the .tsx extension to tell TypeScript about embedded JSX ￼. For example, App.tsx is already created for you. The Vite template includes a tsconfig.json with "jsx": "react-jsx", so TypeScript will transpile JSX automatically.

TypeScript fully supports JSX out of the box ￼. The key difference from plain JavaScript is that you can add type annotations for props and state. The official React docs note: “Writing TypeScript with React is very similar to writing JavaScript with React. The key difference … is that you can provide types for your component’s props” ￼. In practice, that means defining interfaces or type aliases for component props and annotating hooks. You’ll still write JSX as usual, but use as-style assertions instead of angle-bracket assertions in TSX (e.g. value as Foo, not <Foo>value ￼).

3. Functional Components with Typed Props

A functional component in React is just a function returning JSX. With TypeScript, we annotate its props. There are two common patterns:
	•	Inline annotation: Add a type directly in the parameter list.
	•	Interface/type alias: Define a props interface or type, then use it.

For example, suppose we want a Greeting component that takes a name: string prop. We could write:

// Inline type annotation
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Or using an interface
interface GreetingProps {
  name: string;
}
function GreetingAlt({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}

In both cases, TypeScript knows name is a string. If you pass the wrong type, TS will flag an error. Note that default React types (from @types/react) are already included in the Vite template, so you don’t need to install them manually. This matches the React docs guidance that components’ props “should be an object type described with either a type or interface” ￼.

You can extend the props as needed. For example, adding an optional age prop:

interface PersonProps {
  name: string;
  age?: number; // optional
}
function Person({ name, age }: PersonProps) {
  return <div>{name}{age && `, age ${age}`}</div>;
}

Here the age? means the prop is optional. TypeScript will enforce the types, giving you inline documentation and compile-time checks (as React docs describe ￼).

4. Component State with Hooks

Managing state in function components (using React Hooks) works the same as in JavaScript, but you can annotate state types if needed. The most common hook is useState. By default, TypeScript infers the state type from the initial value. For example:

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // count inferred as number
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

In this example, count is inferred as number because we initialized it with 0. The React docs confirm that TS reuses the initial state value’s type automatically ￼. If you ever need to declare a different type (for example, using a union or complex object), you can pass a type argument: useState<MyType>(initialValue) [oai_citation:8‡react.dev](https://react.dev/learn/typescript#:~:text=This%20will%20assign%20the%20type,call). For instance:

// Explicit type argument example
const [enabled, setEnabled] = useState<boolean>(false);

Often the inference is enough, but explicit generics can be useful for clarity with more complex states.

5. Event Handling with Type Annotations

When handling events (like clicks or input changes), React’s types come in handy. For example, typing a click handler:

import React from 'react';

function Clicker() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked', e);
  };

  return <button onClick={handleClick}>Click me</button>;
}

Here we annotate e as React.MouseEvent<HTMLButtonElement>, which is the standard type for button click events. Similarly, for text input changes:

function NameInput() {
  const [name, setName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return <input value={name} onChange={handleChange} />;
}

React.ChangeEvent<HTMLInputElement> tells TypeScript that e.target is an input element, so e.target.value is a string. These React event types (from @types/react) make event handling type-safe. (You can find more on React’s built-in event types in the React TypeScript docs and @types/react.)

6. JSX in TypeScript – Gotchas

Writing JSX in TypeScript is mostly straightforward, but there are a few gotchas to watch for:
	•	Type Assertions: In TSX files, you cannot use the angle-bracket assertion syntax (<Foo>bar). This conflicts with JSX. Instead, always use the as operator. For example, if you have a DOM element ref, do:

const input = document.getElementById('my-input') as HTMLInputElement;

The TypeScript handbook specifically notes that angle-bracket type assertions are disallowed in .tsx files; use the as syntax instead ￼.

	•	Correct File Extensions: Remember to use .tsx (not .ts) whenever you return JSX. Otherwise the JSX syntax will cause a compile error ￼.
	•	Generic Components: If you create a generic component (with <T>) be careful, as the syntax can be confused with JSX. You often need to use an alias to avoid ambiguity.
	•	Children Prop: By default, a component’s children prop is of type React.ReactNode. If you want to type children explicitly (e.g. expecting a single string child), you can include children: React.ReactNode or a more specific type in your props interface. For basic components, you usually don’t need to do this, since React already types children.

Most simple components won’t hit these issues often. The key rule is: use as for type casting in JSX ￼ and ensure your file extensions and tsconfig jsx setting match.

7. Summary

To recap, setting up React with TypeScript via Vite is easy with the --template react-ts option ￼. From there, you write components in .tsx files, adding types to props and state. For example, annotate props via interfaces and use useState<Type>() or let TypeScript infer from initial values ￼. Use React’s types for events (MouseEvent, ChangeEvent, etc.) to type your handlers. And remember TSX-specific rules: .tsx extension and using the as syntax for type assertions ￼ ￼.

By following these basics, you’ll benefit from TypeScript’s type checking in your React components. For more detailed guidance, see the official React TypeScript documentation and the TypeScript JSX handbook for further reading. Happy coding!

Sources: Official Vite, React, and TypeScript documentation and tutorials ￼ ￼ ￼ ￼.